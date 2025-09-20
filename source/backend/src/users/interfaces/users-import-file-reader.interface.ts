import { UserImportType } from '@api/users/types';

export interface IUsersImportFileReader {
  supports(mimeType: string): boolean;
  read(filePath: string): Promise<UserImportType[]>;
}
