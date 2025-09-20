import { UserImportType } from '@api/users/types';
import { Branch } from '@api/branch/entities';
import { AbstractStep } from '@api/shared/sequence';
import {
  SEQUENCE_ACCOUNT_ID_KEY,
  SEQUENCE_BRANCHES_KEY,
  SEQUENCE_ERROR_KEY,
} from '@api/shared/sequence/constants';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { v4 } from 'uuid';

@Injectable()
export class CreateBranchesStep extends AbstractStep {
  constructor(private readonly em: EntityManager) {
    super();
  }

  public async process(payload: UserImportType[]): Promise<UserImportType[]> {
    const logger = this.getLogger();

    await logger.log('Create branches step initiated!');

    try {
      const branchNames = Array.from(
        new Set(
          payload
            .filter((user) => isNotEmpty(user.branch))
            .map((user) => user.branch),
        ),
      );

      if (!branchNames.length) {
        return payload;
      }

      const accountId = this.context.getIndex<string>(SEQUENCE_ACCOUNT_ID_KEY);

      await this.em
        .createQueryBuilder(Branch)
        .insert(
          branchNames.map((branchName) => ({
            id: v4(),
            name: branchName,
            account: accountId,
            created: new Date(),
            active: true,
          })),
        )
        .onConflict()
        .ignore();

      const branches: Record<string, string> = (
        await this.em.find(
          Branch,
          {
            name: branchNames,
            account: accountId,
          },
          {
            populate: ['id', 'name'],
          },
        )
      ).reduce((acc, branch) => {
        acc[branch.name] = branch.id;

        return acc;
      }, {});

      this.context.addIndex(SEQUENCE_BRANCHES_KEY, branches);

      await logger.log('Create branches step finished!');
    } catch (error) {
      this.context.addIndex(SEQUENCE_ERROR_KEY, error);
      this.setIsFinal(true);
    }

    return payload;
  }
}
