import { IUsersImportFileReader } from '@api/users/interfaces';
import { UserImportType } from '@api/users/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportUsersFileReaderFactory {
  constructor(private readonly fileReaders: IUsersImportFileReader[]) {}

  public async readFile(
    mimeType: string,
    filePath: string,
  ): Promise<UserImportType[]> {
    const reader = this.fileReaders.find((fr) => fr.supports(mimeType));

    return reader.read(filePath);
  }
}
