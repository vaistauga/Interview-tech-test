import { UserImportType } from '@api/users/types';
import { Group } from '@api/group/entities';
import { AbstractStep } from '@api/shared/sequence';
import {
  SEQUENCE_ACCOUNT_ID_KEY,
  SEQUENCE_AUTO_ASSIGN_GROUPS_KEY,
  SEQUENCE_ERROR_KEY,
} from '@api/shared/sequence/constants';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoadAutoAssignGroupsStep extends AbstractStep {
  constructor(private readonly em: EntityManager) {
    super();
  }

  public async process(payload: UserImportType[]): Promise<UserImportType[]> {
    const logger = this.getLogger();

    await logger.log('Load auto-assign groups step initiated!');

    try {
      const accountId = this.context.getIndex<string>(SEQUENCE_ACCOUNT_ID_KEY);

      if (!accountId) {
        throw new Error('Account ID is missing!');
      }

      const autoAssignGroups = await this.em.find(Group, {
        account: accountId,
        autoAssign: true,
      });

      this.context.addIndex(
        SEQUENCE_AUTO_ASSIGN_GROUPS_KEY,
        autoAssignGroups.map((group) => group.id),
      );

      await logger.log('Load auto-assign groups step finished!');
    } catch (error) {
      this.context.addIndex(SEQUENCE_ERROR_KEY, error);
      this.setIsFinal(true);
    }

    return payload;
  }
}
