import { TUserImportResult } from '@api/users/types';
import { AbstractStep } from '@api/shared/sequence';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from '@api/users/entities';

@Injectable()
export class FlushAndReFetchUserStep extends AbstractStep {
  public constructor() {
    super();
  }

  async process(
    payload: TUserImportResult & {
      em: EntityManager;
    },
  ): Promise<TUserImportResult> {
    await payload.em.flush();

    // Re-fetch user entity
    const userEntity = await payload.em.findOne(
      User,
      {
        id: payload.user.id,
      },
      {
        connectionType: 'write',
      },
    );
    await userEntity?.groups.init();

    return { user: userEntity, oldState: payload.oldState };
  }
}
