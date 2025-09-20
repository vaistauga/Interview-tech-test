import { EntityManager, Reference } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { Branch } from '../branch/entities/branch.entity';
import { Account } from '../accounts/entities/account.entity';

export class BranchSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const branches: Branch[] = [];
    
    // Get all accounts
    const accounts = await em.find(Account, {});
    
    // Generate 3 branches per account
    for (const account of accounts) {
      for (let i = 0; i < 3; i++) {
        const branch = new Branch();
        branch.name = `${faker.location.city()} Office`;
        branch.account = Reference.createFromPK(Account, account.id);
        
        branches.push(branch);
      }
    }

    // Persist all branches
    em.persist(branches);
    await em.flush();

    console.log(`✅ Created ${branches.length} branches`);
  }
} 