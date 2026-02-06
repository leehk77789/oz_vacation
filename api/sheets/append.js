const { google } = require("googleapis");
const { Readable } = require("stream");

const getServiceAccount = () => {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error(
      "Missing service account credentials. Set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_CLIENT_EMAIL/GOOGLE_PRIVATE_KEY."
    );
  }

  return {
    client_email: clientEmail,
    private_key: privateKey,
  };
};

const getAuthClient = () => {
  const serviceAccount = getServiceAccount();
  return new google.auth.JWT(
    serviceAccount.client_email,
    undefined,
    serviceAccount.private_key?.replace(/\\n/g, "\n"),
    [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ]
  );
};

const getSheetsClient = () => {
  const auth = getAuthClient();
  return google.sheets({ version: "v4", auth });
};

const getDriveClient = () => {
  const auth = getAuthClient();
  return google.drive({ version: "v3", auth });
};

const uploadPdfToDrive = async ({ pdfBase64, fileName }) => {
  if (!pdfBase64) return "";
  const drive = getDriveClient();
  const buffer = Buffer.from(pdfBase64, "base64");
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const requestBody = {
    name: fileName || "vacation.pdf",
    mimeType: "application/pdf",
    parents: folderId ? [folderId] : undefined,
  };
  const media = {
    mimeType: "application/pdf",
    body: Readable.from(buffer),
  };
  const createResponse = await drive.files.create({
    requestBody,
    media,
    supportsAllDrives: true,
    fields: "id, webViewLink, webContentLink",
  });

  const fileId = createResponse.data.id;
  if (fileId && process.env.GOOGLE_DRIVE_PUBLIC === "1") {
    try {
      await drive.permissions.create({
        fileId,
        supportsAllDrives: true,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
    } catch (error) {
      // Keep the upload even if public sharing is blocked.
      console.warn("Drive permission update failed:", error?.message || error);
    }
  }

  const downloadLink = fileId
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : "";

  return (
    downloadLink ||
    createResponse.data.webViewLink ||
    createResponse.data.webContentLink ||
    ""
  );
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
    const { row, pdfBase64, fileName } = payload;

    if (!Array.isArray(row)) {
      return res.status(400).json({ error: "row must be an array" });
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      return res.status(500).json({ error: "Missing GOOGLE_SHEET_ID" });
    }

    const sheetName = process.env.GOOGLE_SHEET_NAME || "Sheet1";
    const normalizedRow = row.map((value) =>
      value === undefined ? "" : value
    );

    if (pdfBase64) {
      const fileLink = await uploadPdfToDrive({ pdfBase64, fileName });
      if (!fileLink) {
        return res.status(500).json({ error: "Drive upload failed" });
      }
      while (normalizedRow.length < 23) {
        normalizedRow.push("");
      }
      if (!normalizedRow[22]) {
        normalizedRow[22] = fileLink;
      }
    }

    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [normalizedRow] },
    });

    return res.json({
      ok: true,
      updatedRange: response.data.updates?.updatedRange,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return res.status(500).json({ error: message });
  }
};

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

