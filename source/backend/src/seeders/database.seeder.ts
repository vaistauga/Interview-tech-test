import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { AccountSeeder } from './account.seeder';
import { BranchSeeder } from './branch.seeder';
import { GroupSeeder } from './group.seeder';
import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    // Run seeders in order of dependencies
    await this.call(em, [
      AccountSeeder,    // First create accounts
      BranchSeeder,     // Then create branches (depends on accounts)
      GroupSeeder,      // Then create groups (depends on accounts)
      RoleSeeder,       // Create roles before users
      UserSeeder,       // Finally create users (depends on accounts, branches, groups, and roles)
    ]);
    
    console.log('✅ Database seeding completed!');
  }
} 