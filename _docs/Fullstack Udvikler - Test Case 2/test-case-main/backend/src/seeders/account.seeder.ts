import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { Account } from '../accounts/entities/account.entity';
import { Language } from '../shared/enums';

export class AccountSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const accounts: Account[] = [];

    // Generate 5 accounts
    for (let i = 0; i < 5; i++) {
      const account = new Account();
      account.name = faker.company.name();
      account.description = faker.company.catchPhrase();
      account.defaultLanguage = faker.helpers.arrayElement(Object.values(Language));
      account.isFreeTrial = faker.datatype.boolean(0.3); // 30% chance of being in free trial
      
      accounts.push(account);
    }

    // Persist all accounts
    em.persist(accounts);
    await em.flush();

    console.log(`✅ Created ${accounts.length} accounts`);
  }
} 