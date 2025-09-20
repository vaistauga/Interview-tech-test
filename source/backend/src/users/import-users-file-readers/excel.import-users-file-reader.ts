import { IUsersImportFileReader } from '@api/users/interfaces';
import { USER_IMPORT_TYPE_KEYS, UserImportType } from '@api/users/types';
import { EXCEL_MIME_TYPES } from '@api/files/constants';
import { Injectable } from '@nestjs/common';
import { ExcelParserService } from '@api/shared/services';
import { SheetConfig } from '@api/shared/types';
import * as fs from 'fs';

@Injectable()
export class ExcelImportUsersFileReader implements IUsersImportFileReader {
  constructor(private readonly excelParserService: ExcelParserService) {}

  public supports(mimeType: string): boolean {
    return EXCEL_MIME_TYPES.includes(mimeType);
  }

  public async read(filePath: string): Promise<UserImportType[]> {
    return this.parseExcelFile(filePath);
  }

  protected async parseExcelFile(filePath: string): Promise<UserImportType[]> {
    let users: UserImportType[] = [];

    const sheetConfig: SheetConfig<UserImportType> = {
      identifier: 1,
      keys: USER_IMPORT_TYPE_KEYS,
      onParsed: async (data) => {
        users = data as UserImportType[];
      },
    };

    const chunks: Buffer[] = [];
    const readStream = fs.createReadStream(filePath);

    await new Promise<void>((resolve, reject) => {
      readStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      readStream.on('end', () => resolve());
      readStream.on('error', (error) => reject(error));
    });

    await this.excelParserService.parseExcelFile([sheetConfig], chunks);

    return users;
  }
}
