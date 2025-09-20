export type TWorksheetImportError = {
  rowNumber: number;
  errors: Record<string, string[]>;
};
