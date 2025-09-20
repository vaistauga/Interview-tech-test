export type TUserImportError = {
  rowNumber: number;
  errors: Record<string, string[]>;
};
