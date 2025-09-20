import {
  ALLOWED_USERS_IMPORT_ROLES,
  CHUNK_SIZE,
} from '@api/users/constants';
import { Account } from '@api/accounts/entities';
import { UserImportType } from '@api/users/types';
import { Branch } from '@api/branch/entities';
import { AbstractStep } from '@api/shared/sequence';
import {
  SEQUENCE_ACCOUNT_ID_KEY,
  SEQUENCE_ENTITY_ID_KEY,
  SEQUENCE_ENTITY_TYPE_KEY,
  SEQUENCE_ERROR_KEY,
} from '@api/shared/sequence/constants';
import { Role } from '@api/users/entities';
import { SystemRoles } from '@api/users/enums';
import { EntityName, FlushMode } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { chunk } from 'lodash';
import { Group } from '@api/group/entities';

@Injectable()
export class ChunkUsersStep extends AbstractStep {
  constructor(private readonly em: EntityManager) {
    super();
  }

  public async start(payload: UserImportType[]): Promise<void> {
    try {
      let rowNumber = 2; // Skip the header row
      const chunks = await this.process(payload);

      if (this.isFinal()) {
        return;
      }

      for (const chunk of chunks) {
        const em = this.em.fork({
          clear: true,
          flushMode: FlushMode.COMMIT,
        });

        const entity = await em.findOneOrFail(
          this.context.getIndex<EntityName<Account | Branch | Group>>(
            SEQUENCE_ENTITY_TYPE_KEY,
          ),
          {
            id: this.context.getIndex(SEQUENCE_ENTITY_ID_KEY),
          },
        );

        const account = await em.findOneOrFail(Account, {
          id: this.context.getIndex(SEQUENCE_ACCOUNT_ID_KEY),
        });

        const rolesMap: Record<SystemRoles, string> = (
          await em.find(
            Role,
            {
              code: ALLOWED_USERS_IMPORT_ROLES,
            },
            {
              fields: ['id', 'code'],
            },
          )
        ).reduce((acc, role) => {
          acc[role.code] = role.id;

          return acc;
        }, {}) as Record<SystemRoles, string>;

        for (const user of chunk) {
          await this.next.start({
            em,
            rowNumber,
            user,
            account,
            entity,
            rolesMap,
          });
          rowNumber++;
        }
      }
    } catch (error) {
      this.context.addIndex(SEQUENCE_ERROR_KEY, error);
      this.setIsFinal(true);
    }
  }

  public async process(payload: UserImportType[]): Promise<UserImportType[][]> {
    await this.getLogger().log('Chunk users step initiated!');

    try {
      return chunk(payload, CHUNK_SIZE);
    } catch (error) {
      this.context.addIndex(SEQUENCE_ERROR_KEY, error);
      this.setIsFinal(true);
    }
  }
}
