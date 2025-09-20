import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../../mikro-orm.config';
import { DatabaseSeeder } from '../seeders/database.seeder';

async function seed() {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);
  const generator = orm.getSchemaGenerator();
  const seeder = orm.getSeeder();

  try {
    console.log('🌱 Starting database seeding...');
    
    // Run the database seeder
    await seeder.seed(DatabaseSeeder);
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await orm.close();
  }
}

seed(); 