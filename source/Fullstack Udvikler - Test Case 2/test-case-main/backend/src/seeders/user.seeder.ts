import { EntityManager, Reference } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { Branch } from '../branch/entities/branch.entity';
import { Group } from '../group/entities/group.entity';
import { Role } from '../users/entities/role.entity';
import { Language } from '../shared/enums';
import { UserOrigin } from '../users/enums';
import { UserMeta } from '@api/users/entities/user-meta.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users: User[] = [];

    // Get all accounts, branches, groups, and roles
    const accounts = await em.find(Account, {});
    const branches = await em.find(Branch, {});
    const groups = await em.find(Group, {});
    const roles = await em.find(Role, {});

    // Generate 20 users
    for (let i = 0; i < 20; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();
      const password = 'password123'; // Default password for all seeded users
      const username = faker.internet.username({ firstName, lastName }).toLowerCase();
      const phoneNumber = faker.phone.number();
      const companyName = faker.company.name();
      const city = faker.location.city();

      const user = new User();
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = password;
      user.username = username;
      user.meta = new UserMeta();
      user.meta.mobilePhone = phoneNumber;
      user.meta.companyName = companyName;
      user.meta.officeLocation = city;
      
      // Randomize some properties
      user.isActive = faker.datatype.boolean(0.9); // 90% chance of being active
      user.language = faker.helpers.arrayElement(Object.values(Language));
      user.origin = faker.helpers.arrayElement(Object.values(UserOrigin));
      
      // Assign random account
      const randomAccount = faker.helpers.arrayElement(accounts);
      user.account = Reference.createFromPK(Account, randomAccount.id);
      
      // Assign random branch from the same account
      const accountBranches = branches.filter(b => b.account.id === randomAccount.id);
      if (accountBranches.length > 0) {
        const randomBranch = faker.helpers.arrayElement(accountBranches);
        user.branch = Reference.createFromPK(Branch, randomBranch.id);
      }
      
      // Assign random groups from the same account
      const accountGroups = groups.filter(g => g.account.id === randomAccount.id);
      if (accountGroups.length > 0) {
        const numGroups = faker.number.int({ min: 1, max: Math.min(3, accountGroups.length) });
        const randomGroups = faker.helpers.arrayElements(accountGroups, numGroups);
        user.groups.set(randomGroups);
      }

      // Assign random role
      const randomRole = faker.helpers.arrayElement(roles);
      user.role = Reference.createFromPK(Role, randomRole.id);
      
      users.push(user);
    }

    // Persist all users
    em.persist(users);
    await em.flush();

    console.log(`✅ Created ${users.length} users`);
  }
} 