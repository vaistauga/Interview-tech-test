import {
  ON_ACCOUNT_IMPORT_USERS_SEQUENCE,
} from '../constants';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventBus } from '@nestjs/cqrs';
import { Provider } from '@nestjs/common';
import { ImportUsersFileReaderFactory } from '@api/users/factories';
import { ReadFileStep } from '@api/users/steps/read-file.step';
import { CreateBranchesStep } from '@api/users/steps/create-branches.step';
import { CreateGroupsStep } from '@api/users/steps/create-groups.step';
import { LoadAutoAssignGroupsStep } from '@api/users/steps/load-auto-assign-groups.step';
import { ChunkUsersStep } from '@api/users/steps/chunk-users.step';
import { AccountProcessUserStep } from '@api/users/steps/account-process-user.step';
import { FlushAndReFetchUserStep } from '@api/users/steps/flush-and-re-fetch-user.step';
import { TriggerUserSavedEventStep } from '@api/users/steps/trigger-user-saved-event.step';
import { Sequence } from '@api/shared/sequence';


export const onAccountImportSequenceProvider: Provider = {
  provide: ON_ACCOUNT_IMPORT_USERS_SEQUENCE,
  inject: [
    EntityManager,
    ImportUsersFileReaderFactory,
    EventBus,
  ],
  useFactory:
    (
      em: EntityManager,
      importUsersFileReaderFactory: ImportUsersFileReaderFactory,
      eventBus: EventBus,
    ) =>
    () =>
      new Sequence([
        new ReadFileStep(em, importUsersFileReaderFactory),
        new CreateBranchesStep(em),
        new CreateGroupsStep(em),
        new LoadAutoAssignGroupsStep(em),
        new ChunkUsersStep(em),
        new AccountProcessUserStep(),
        new FlushAndReFetchUserStep(),
        new TriggerUserSavedEventStep(eventBus),
      ]),
};

