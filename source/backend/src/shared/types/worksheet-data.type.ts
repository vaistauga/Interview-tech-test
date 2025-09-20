import { Worksheet } from 'exceljs';

export type WorksheetData = {
  name?: string;
  columns: Record<string, any>[];
  insertData: (worksheet: Worksheet, options: any) => Promise<number>;
};
