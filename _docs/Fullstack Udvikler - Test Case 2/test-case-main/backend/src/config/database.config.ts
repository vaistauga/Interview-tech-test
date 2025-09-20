import { registerAs } from '@nestjs/config';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export const databaseConfig = registerAs(
  'database',
  (): MikroOrmModuleOptions => ({
    driver: PostgreSqlDriver,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    dbName: process.env.DATABASE_NAME || 'cyber_pilot_db',
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    debug: process.env.NODE_ENV !== 'production',
    autoLoadEntities: true,
    migrations: {
      path: 'dist/migrations',
      pathTs: 'src/migrations',
    },
  }),
); 