import { Injectable } from '@nestjs/common';
import { SheetConfig } from '@api/shared/types';
import { Cell, Row, ValueType, Workbook, Worksheet } from 'exceljs';
import { camelCase } from 'lodash';

@Injectable()
export class ExcelParserService {
  private static readonly IGNORED_NODES = [
    'sheetPr',
    'dimension',
    'sheetViews',
    'sheetFormatPr',
    'cols',
    'autoFilter',
    'mergeCells',
    'rowBreaks',
    'hyperlinks',
    'pageMargins',
    'dataValidations',
    'pageSetup',
    'headerFooter',
    'printOptions',
    'picture',
    'drawing',
    'sheetProtection',
    'tableParts',
    'conditionalFormatting',
    'extLst',
  ];

  public async parseExcelFile(
    sheetConfigs: SheetConfig[],
    chunks: any[],
  ): Promise<void> {
    const workbook = await this.loadWorkbook(chunks);

    for (const config of sheetConfigs) {
      const worksheet = workbook.getWorksheet(config.identifier);

      if (!worksheet) {
        throw new Error(`Worksheet "${config.identifier}" not found`);
      }

      const sheetData = this.parseWorksheet(worksheet, config.keys);
      await config.onParsed(sheetData);

      worksheet.destroy();
    }
  }

  private async loadWorkbook(chunks: any[]): Promise<Workbook> {
    const workbook = new Workbook();
    await workbook.xlsx.load(Buffer.concat(chunks), {
      ignoreNodes: ExcelParserService.IGNORED_NODES,
    });
    return workbook;
  }

  private parseWorksheet<T extends object>(
    worksheet: Worksheet,
    importTypeKeys: (keyof T)[],
  ): Partial<T>[] {
    const headersIndexMap = this.createHeadersIndexMap(
      worksheet.getRow(1),
      importTypeKeys,
    );
    const rows: Partial<T>[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return; // Skip header row
      }

      rows.push(this.parseRow(row, headersIndexMap));
    });

    return rows;
  }

  private createHeadersIndexMap<T>(
    headerRow: Row,
    importTypeKeys: (keyof T)[],
  ): Map<number, keyof T> {
    const headersIndexMap = new Map<number, keyof T>();

    headerRow.eachCell((cell: Cell, colNumber: number) => {
      if (cell.type !== ValueType.String) {
        throw new Error('Invalid header type. Header must be string.');
      }

      const header = camelCase(cell.value as string) as keyof T;

      if (importTypeKeys.includes(header)) {
        headersIndexMap.set(colNumber, header);
      }
    });

    return headersIndexMap;
  }

  private parseRow<T>(
    row: Row,
    headersIndexMap: Map<number, keyof T>,
  ): Partial<T> {
    const rowObject: Partial<T> = {};

    row.eachCell((cell: Cell, colNumber: number) => {
      const header = headersIndexMap.get(colNumber);
      if (header) {
        rowObject[header] = this.normalizeCellValue(cell);
      }
    });

    return rowObject;
  }

  private normalizeCellValue(cell: Cell): any {
    if (cell.type === ValueType.Error) {
      throw new Error(`Cell error: ${cell.value}`);
    }

    if (cell.type === ValueType.RichText) {
      return cell.text;
    }

    if (cell.type === ValueType.Formula) {
      return cell.result;
    }

    return cell.value;
  }
}
