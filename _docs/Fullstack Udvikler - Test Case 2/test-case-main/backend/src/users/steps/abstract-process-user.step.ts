import { USERS_IMPORT_ERRORS } from '@api/users/constants';
import { Account } from '@api/accounts/entities';
import {
  TUserImportError,
  TUserImportResult,
  UserImportType,
} from '@api/users/types';
import { Branch } from '@api/branch/entities';
import { Group } from '@api/group/entities';
import { Language } from '@api/shared/enums';
import { isNotNullOrUndefined } from '@api/shared/helpers';
import { AbstractStep } from '@api/shared/sequence';
import {
  SEQUENCE_AUTO_ASSIGN_GROUPS_KEY,
  SEQUENCE_CLOUD_DIRECTORY_INTEGRATIONS_STATUS_KEY,
  SEQUENCE_ERROR_KEY,
} from '@api/shared/sequence/constants';
import { Role, User } from '@api/users/entities';
import { SystemRoles, UserOrigin } from '@api/users/enums';
import { Reference, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isNotEmpty, validate } from 'class-validator';
import { v4 } from 'uuid';
import * as moment from 'moment/moment';
import { UserImportDto } from '../dto';

@Injectable()
export abstract class AbstractProcessUserStep extends AbstractStep {
  public async start(payload: any): Promise<void> {
    try {
      const response = await this.process(payload);

      if (!response) {
        return;
      }

      if (!this.isFinal()) {
        await this.next.start(response);
      }
    } catch (e) {
      this.getLogger().error(e);
    }
  }

  public async process(payload: {
    em: EntityManager;
    rowNumber: number;
    user: UserImportType;
    account: Account;
    entity: Account | Branch;
    rolesMap: Record<SystemRoles, string>;
  }): Promise<
    | (TUserImportResult & {
        em: EntityManager;
      })
    | null
  > {
    await this.getLogger().log(`Process user ${payload.user?.username}!`);

    try {
      const result = await this.importUser(payload);

      if ('errors' in result) {
        this.context
          .getIndex<TUserImportError[]>(USERS_IMPORT_ERRORS)
          .push(result);

        return null;
      }

      return { ...result, em: payload.em };
    } catch (error) {
      this.context.addIndex(SEQUENCE_ERROR_KEY, error);
      this.setIsFinal(true);
    }
  }

  protected abstract importUser(payload: {
    em: EntityManager;
    rowNumber: number;
    user: UserImportType;
    account: Account;
    entity: Account | Branch | Group;
    rolesMap: Record<SystemRoles, string>;
  }): Promise<TUserImportError | TUserImportResult>;

  protected async populateUserEntity(
    em: EntityManager,
    account: Account,
    user: UserImportType,
    rowNumber: number,
    rolesMap: Record<SystemRoles, string>,
  ): Promise<TUserImportError | TUserImportResult> {
    const cloudDirectoryIntegrationsActive = this.context.getIndex<boolean>(
      SEQUENCE_CLOUD_DIRECTORY_INTEGRATIONS_STATUS_KEY,
    );

    user.username = user.username?.toLowerCase();
    user.role = user.role?.toLowerCase();

    const validationError = await this.validateUser(user, rowNumber);

    if (validationError) {
      return validationError;
    }

    let userEntity = await em.findOne(User, {
      username: user.username,
    });

    if (
      !!userEntity &&
      cloudDirectoryIntegrationsActive &&
      [UserOrigin.AZURE_AD, UserOrigin.GOOGLE_WORKSPACE].includes(
        userEntity.origin,
      )
    ) {
      if (
        Object.keys(user)
          .filter((k) => !['username', 'groups'].includes(k))
          .filter((k) => isNotEmpty(user[k])).length > 0
      ) {
        return {
          rowNumber,
          errors: {
            username: [
              'This user is synced by a Cloud Directory, so only the Groups column has been updated.',
            ],
          },
        };
      }

      return {
        rowNumber,
        user: userEntity,
        oldState: wrap(userEntity).toPOJO(),
      };
    }

    if (!!userEntity && userEntity.account.id !== account.id) {
      return {
        rowNumber,
        errors: {
          username: [
            'User with this username already exists in another account.',
          ],
        },
      };
    }

    let oldState = null;

    if (!!userEntity) {
      await userEntity.groups.init();
      oldState = wrap(userEntity).toPOJO();

      userEntity.language = isNotEmpty(user.language)
        ? (user.language.trim() as Language)
        : (userEntity.language ?? account?.defaultLanguage ?? Language.EN);
    } else {
      userEntity = new User();
      userEntity.id = v4();
      userEntity.username = user.username;
      userEntity.password = v4();
      userEntity.setAccount(account);
      userEntity.language = isNotEmpty(user.language)
        ? (user.language.trim() as Language)
        : (account?.defaultLanguage ?? Language.EN);
      userEntity.origin = cloudDirectoryIntegrationsActive
        ? UserOrigin.MANUAL
        : UserOrigin.DEFAULT;
      userEntity.freeTrialEndsAt = account.isFreeTrial
        ? moment().utc().add(3, 'days').toDate() // Free trial days
        : null;

      em.persist(userEntity);

      await this.assignGroupsIfFound(userEntity);
    }

    userEntity.email = user.email ?? userEntity.email;
    userEntity.firstName = user.firstName ?? userEntity.firstName;
    userEntity.lastName = user.lastName ?? userEntity.lastName;
    userEntity.isActive = isNotNullOrUndefined(user.active)
      ? String(user.active) === '1'
      : userEntity.isActive;
    userEntity.role = isNotNullOrUndefined(user.role)
      ? Reference.createFromPK(Role, rolesMap[user.role as SystemRoles])
      : oldState !== null
        ? userEntity.role
        : Reference.createFromPK(Role, rolesMap.learner);
    userEntity.meta = {
      ...userEntity.meta,
      companyName:
        user.companyName && isNotEmpty(user.companyName)
          ? String(user.companyName)
          : userEntity?.meta?.companyName,
      department:
        user.department && isNotEmpty(user.department)
          ? String(user.department)
          : userEntity?.meta?.department,
      manager:
        user.manager && isNotEmpty(user.manager)
          ? String(user.manager)
          : userEntity?.meta?.manager,
      country:
        user.country && isNotEmpty(user.country)
          ? String(user.country)
          : userEntity?.meta?.country,
      jobTitle:
        user.jobTitle && isNotEmpty(user.jobTitle)
          ? String(user.jobTitle)
          : userEntity?.meta?.jobTitle,
      mobilePhone:
        user.mobilePhone && isNotEmpty(user.mobilePhone)
          ? String(user.mobilePhone)
          : userEntity?.meta?.mobilePhone,
      officeLocation:
        user.officeLocation && isNotEmpty(user.officeLocation)
          ? String(user.officeLocation)
        : userEntity?.meta?.officeLocation,
      managerEmail:
        user.managerEmail && isNotEmpty(user.managerEmail)
          ? String(user.managerEmail)
          : userEntity?.meta?.managerEmail,
    };

    return { user: userEntity, oldState };
  }

  private async assignGroupsIfFound(user: User) {
    const autoAssignGroups = this.context.getIndex<string[]>(
      SEQUENCE_AUTO_ASSIGN_GROUPS_KEY,
    );

    if (autoAssignGroups.length === 0) {
      return;
    }

    user.groups.add(
      autoAssignGroups.map((groupId) => Reference.createFromPK(Group, groupId)),
    );
  }

  private async validateUser(
    user: UserImportType,
    rowNumber: number,
  ): Promise<TUserImportError | null> {
    const userClass = plainToInstance(UserImportDto, user);
    const errors = await validate(userClass);
    const userError = {
      rowNumber,
      errors: errors.reduce((acc, error) => {
        acc[error.property] = Object.values(error.constraints);

        return acc;
      }, {}),
    };

    return errors.length > 0 ? userError : null;
  }
}
