import { UserImportType } from '@api/users/types';
import { Group } from '@api/group/entities';
import { AbstractStep } from '@api/shared/sequence';
import {
  SEQUENCE_ACCOUNT_ID_KEY,
  SEQUENCE_ERROR_KEY,
  SEQUENCE_GROUPS_KEY,
} from '@api/shared/sequence/constants';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { v4 } from 'uuid';

@Injectable()
export class CreateGroupsStep extends AbstractStep {
  constructor(private readonly em: EntityManager) {
    super();
  }

  public async process(payload: UserImportType[]): Promise<UserImportType[]> {
    const logger = this.getLogger();

    await logger.log('Create groups step initiated!');

    try {
      const groupNames = Array.from(
        new Set(
          payload
            .filter((user) => isNotEmpty(user.groups))
            .flatMap((user) => user.groups.split(','))
            .map((g) => g.trim())
            .filter((g) => isNotEmpty(g)),
        ),
      );

      if (!groupNames.length) {
        return payload;
      }

      const accountId = this.context.getIndex<string>(SEQUENCE_ACCOUNT_ID_KEY);

      await this.em
        .createQueryBuilder(Group)
        .insert(
          groupNames.map((groupName) => ({
            id: v4(),
            name: groupName,
            account: accountId,
            created: new Date(),
            active: true,
          })),
        )
        .onConflict()
        .ignore();

      const groups: Record<string, string> = (
        await this.em.find(
          Group,
          {
            name: groupNames,
            account: accountId,
          },
          {
            populate: ['id', 'name'],
          },
        )
      ).reduce((acc, group) => {
        acc[group.name] = group.id;

        return acc;
      }, {});

      this.context.addIndex(SEQUENCE_GROUPS_KEY, groups);

      await logger.log('Create groups step finished!');
    } catch (error) {
      this.context.addIndex(SEQUENCE_ERROR_KEY, error);
      this.setIsFinal(true);
    }

    return payload;
  }
}
