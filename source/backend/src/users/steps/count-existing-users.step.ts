import { AbstractStep } from '@api/shared/sequence';
import { UserImportType } from '@api/users/types';
import { User } from '@api/users/entities';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import {
  SEQUENCE_ERROR_KEY,
  SEQUENCE_TOTAL_NEW_USERS_COUNT,
} from '@api/shared/sequence/constants';

export interface ExistingUsersCountResult {
  totalUsers: number;
  existingUsers: number;
  newUsers: number;
  existingUsernames: string[];
}

@Injectable()
export class CountExistingUsersStep extends AbstractStep {
  constructor(private readonly em: EntityManager) {
    super();
  }

  public async start(payload: UserImportType[]): Promise<void> {
    try {
      const result = await this.process(payload);

      if (this.isFinal()) {
        return;
      }

      // Store the count result in the context for use by other steps
      this.context.addIndex(SEQUENCE_TOTAL_NEW_USERS_COUNT, result);

      // Continue with the original payload to the next step
      await this.next.start(payload);
    } catch (error) {
      this.context.addIndex(SEQUENCE_ERROR_KEY, error);
      this.setIsFinal(true);
    }
  }

  public async process(payload: UserImportType[]): Promise<ExistingUsersCountResult> {
    await this.getLogger().log('Count existing users step initiated!');

    try {
      const usernames = payload
        .map(user => user.username)
        .filter((username): username is string => !!username);

      if (usernames.length === 0) {
        await this.getLogger().log('No usernames found in import data');
        return {
          totalUsers: payload.length,
          existingUsers: 0,
          newUsers: payload.length,
          existingUsernames: [],
        };
      }

      // Query the database to find existing users by username
      const existingUsers = await this.em.find(User, {
        username: { $in: usernames },
      }, {
        fields: ['username'],
      });

      const existingUsernames = existingUsers.map(user => user.username);
      const existingUsersCount = existingUsernames.length;
      const newUsersCount = payload.length - existingUsersCount;

      await this.getLogger().log(
        `Found ${existingUsersCount} existing users out of ${payload.length} total users`
      );

      return {
        totalUsers: payload.length,
        existingUsers: existingUsersCount,
        newUsers: newUsersCount,
        existingUsernames,
      };
    } catch (error) {
      this.context.addIndex(SEQUENCE_ERROR_KEY, error);
      this.setIsFinal(true);
      throw error;
    }
  }
}