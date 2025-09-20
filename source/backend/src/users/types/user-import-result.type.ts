import { User } from '@api/users/entities';
import { EntityDTO } from '@mikro-orm/core';

export type TUserImportResult = {
  user: User;
  oldState: EntityDTO<User> | null;
};
