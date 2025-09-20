import { IUsersImportFileReader } from '@api/users/interfaces';
import { UserImportType } from '@api/users/types';
import * as csvParser from '@fast-csv/parse';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class CsvImportUsersFileReader implements IUsersImportFileReader {
  public supports(mimeType: string): boolean {
    return mimeType === 'text/csv';
  }

  public async read(filePath: string): Promise<UserImportType[]> {
    return new Promise<UserImportType[]>((resolve, reject) => {
      const rows: UserImportType[] = [];
      
      fs.createReadStream(filePath)
      .pipe(
        csvParser.parse({
          headers: true,
        }),
      )
      .on('error', (error) => {
        reject(error);
      })
      .on('data', async (data) => {
        rows.push(data);
      })
      .on('end', () => {
        resolve(rows);
      });
    });
  }
}
