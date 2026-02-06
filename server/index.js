const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const { Readable } = require("stream");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(express.json({ limit: "10mb" }));

const corsOrigin = process.env.CORS_ORIGIN;
if (corsOrigin) {
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );
}

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
      // If the Drive policy prevents public sharing, keep the upload and return the link anyway.
      // eslint-disable-next-line no-console
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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/sheets/append", async (req, res) => {
  try {
    const { row, pdfBase64, fileName } = req.body ?? {};
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
      // Only fill the 휴가신청서 제출 column (index 22) if empty
      while (normalizedRow.length < 23) {
        normalizedRow.push("");
      }
      if (!normalizedRow[22]) {
        normalizedRow[22] = fileLink;
      }
    }

    const values = [normalizedRow];

    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
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
});

const port = Number(process.env.PORT) || 5174;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Sheets API server listening on ${port}`);
});
