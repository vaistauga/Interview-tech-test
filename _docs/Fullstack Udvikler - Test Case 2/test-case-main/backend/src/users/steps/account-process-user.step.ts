import { Account } from '@api/accounts/entities';
import { AbstractProcessUserStep } from '@api/users/steps/abstract-process-user.step';
import {
  TUserImportError,
  TUserImportResult,
  UserImportType,
} from '@api/users/types';
import {
  SEQUENCE_AUTO_ASSIGN_GROUPS_KEY,
  SEQUENCE_BRANCHES_KEY,
  SEQUENCE_GROUPS_KEY,
  SEQUENCE_PHISHING_GROUP_KEY,
} from '@api/shared/sequence/constants';
import { SystemRoles } from '@api/users/enums';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { User } from '@api/users/entities';
import { Group } from '@api/group/entities';
import { EntityDTO, Reference } from '@mikro-orm/core';

@Injectable()
export class AccountProcessUserStep extends AbstractProcessUserStep {
  constructor() {
    super();
  }

  public async importUser(payload: {
    em: EntityManager;
    rowNumber: number;
    user: UserImportType;
    account: Account;
    entity: Account;
    rolesMap: Record<SystemRoles, string>;
  }): Promise<TUserImportError | TUserImportResult> {
    const result = await this.populateUserEntity(
      payload.em,
      payload.account,
      payload.user,
      payload.rowNumber,
      payload.rolesMap,
    );

    if ('errors' in result) {
      return result;
    }

    const { user, oldState } = result;

    this.assignBranch(payload, user);

    await this.assignGroups(user, oldState, payload);

    return { user, oldState };
  }

  private async assignGroups(
    user: User,
    oldState: EntityDTO<User> | null,
    payload: {
      rowNumber: number;
      user: UserImportType;
      em: EntityManager;
      entity: Account;
      rolesMap: Record<SystemRoles, string>;
    },
  ) {
    const phishingGroupId = this.context.getIndex<string>(
      SEQUENCE_PHISHING_GROUP_KEY,
    );

    const userGroupIds = (await user.getGroups()).map((group) => group.id);

    const assignedGroupIds: string[] = [];

    if (!oldState) {
      const autoAssignGroups = this.context.getIndex<string[]>(
        SEQUENCE_AUTO_ASSIGN_GROUPS_KEY,
      );

      assignedGroupIds.push(...autoAssignGroups);
    }

    if (!!phishingGroupId && userGroupIds.includes(phishingGroupId)) {
      assignedGroupIds.push(phishingGroupId);
    }

    if (isNotEmpty(payload.user.groups)) {
      const groups = payload.user.groups
        .split(',')
        .map((g) => g.trim())
        .filter((g) => isNotEmpty(g));

      const groupIds = groups
        .filter(
          (groupName) =>
            !phishingGroupId ||
            this.context.getIndex<Record<string, string>>(SEQUENCE_GROUPS_KEY)[
              groupName
            ] !== phishingGroupId,
        )
        .map(
          (groupName) =>
            this.context.getIndex<Record<string, string>>(SEQUENCE_GROUPS_KEY)[
              groupName
            ],
        );

      assignedGroupIds.push(...groupIds);
    }

    user.groups.set(
      assignedGroupIds.map((groupId) => Reference.createFromPK(Group, groupId)),
    );
  }

  private assignBranch(
    payload: {
      rowNumber: number;
      user: UserImportType;
      em: EntityManager;
      entity: Account;
      rolesMap: Record<SystemRoles, string>;
    },
    user: User,
  ) {
    if (isNotEmpty(payload.user.branch)) {
      const branchId = this.context.getIndex<Record<string, string>>(
        SEQUENCE_BRANCHES_KEY,
      )[payload.user.branch];

      user.setBranch(branchId);
    } else {
      user.setBranch(null);
    }
  }
}
