module.exports = async (_req, res) => {
  const required = [
    "GOOGLE_SERVICE_ACCOUNT_JSON",
    "GOOGLE_SHEET_ID",
    "GOOGLE_SHEET_NAME",
    "GOOGLE_DRIVE_FOLDER_ID",
  ];
  const missing = required.filter((key) => !process.env[key]);
  res.status(200).json({
    ok: missing.length === 0,
    missing,
  });
};
