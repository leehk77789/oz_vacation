import axios from "axios";

export type SheetRowValue = string | number | boolean | null;

interface AppendOptions {
  pdfBase64?: string;
  fileName?: string;
}

export const appendVacationRow = async (
  row: SheetRowValue[],
  options?: AppendOptions
) => {
  const payload = {
    row,
    pdfBase64: options?.pdfBase64,
    fileName: options?.fileName,
  };
  const apiBase = import.meta.env.VITE_API_BASE || "";
  const client = axios.create({
    baseURL: apiBase,
  });
  const { data } = await client.post("/api/sheets/append", payload);
  return data;
};
