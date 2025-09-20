import { ImportUsersFileReaderFactory } from '@api/users/factories';
import { UserImportType } from '@api/users/types';
import { File } from '@api/files/entities';
import { AbstractStep } from '@api/shared/sequence';
import {
  SEQUENCE_ERROR_KEY,
  SEQUENCE_TOTAL_USERS_COUNT,
} from '@api/shared/sequence/constants';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReadFileStep extends AbstractStep {
  constructor(
    private readonly em: EntityManager,
    private readonly importUsersFileReaderFactory: ImportUsersFileReaderFactory,
  ) {
    super();
  }

  public async process(fileId: string): Promise<UserImportType[]> {
    const logger = this.getLogger();

    await logger.log('Read file step initiated!');

    let data: UserImportType[];

    try {
      const file = await this.em.findOneOrFail(File, {
        id: fileId,
      });

      await logger.log(`Start reading ${file.mimeType} file!`);

      data = await this.importUsersFileReaderFactory.readFile(
        file.mimeType,
        file.storagePath,
      );

      this.context.addIndex(SEQUENCE_TOTAL_USERS_COUNT, data.length);

      await logger.log('Read file step completed!');
    } catch (error) {
      this.context.addIndex(SEQUENCE_ERROR_KEY, error);
      this.setIsFinal(true);
    }

    return data;
  }
}
