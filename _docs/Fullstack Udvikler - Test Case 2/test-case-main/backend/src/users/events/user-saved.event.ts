import { User } from '@api/users/entities';
import { EntityDTO } from '@mikro-orm/core';
import { IEvent } from '@nestjs/cqrs';

export class UserSavedEvent implements IEvent {
    public constructor(
      public readonly user: EntityDTO<User> & {
          isTemporaryPassword?: boolean;
      },
      public readonly oldState: EntityDTO<User> | null = null,
      public readonly skipKeycloakSync: boolean = false,
    ) {}
}