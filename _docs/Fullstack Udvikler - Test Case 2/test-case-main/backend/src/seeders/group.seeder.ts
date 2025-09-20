import { EntityManager, Reference } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { Group } from '../group/entities/group.entity';
import { Account } from '../accounts/entities/account.entity';

export class GroupSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const groups: Group[] = [];
    
    // Get all accounts
    const accounts = await em.find(Account, {});
    
    // Generate 4 groups per account
    for (const account of accounts) {
      for (let i = 0; i < 4; i++) {
        const group = new Group();
        group.name = faker.helpers.arrayElement([
          'Sales Team',
          'Marketing Team',
          'Development Team',
          'Support Team',
          'HR Team',
          'Finance Team',
          'Operations Team',
          'Management Team'
        ]);
        group.autoAssign = faker.datatype.boolean(0.3); // 30% chance of auto-assign
        group.account = Reference.createFromPK(Account, account.id);
        
        groups.push(group);
      }
    }

    // Persist all groups
    em.persist(groups);
    await em.flush();

    console.log(`✅ Created ${groups.length} groups`);
  }
} 