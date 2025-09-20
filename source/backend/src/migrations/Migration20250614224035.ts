import { Migration } from '@mikro-orm/migrations';

export class Migration20250614224035 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "account" alter column "default_language" type varchar(255) using ("default_language"::varchar(255));`);
    this.addSql(`alter table "account" alter column "default_language" set default 'en_GB';`);

    this.addSql(`alter table "user" drop column "phone_number", drop column "company", drop column "address", drop column "website";`);

    this.addSql(`alter table "user" alter column "language" type varchar(255) using ("language"::varchar(255));`);
    this.addSql(`alter table "user" alter column "language" set default 'en_GB';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "account" alter column "default_language" type varchar(255) using ("default_language"::varchar(255));`);
    this.addSql(`alter table "account" alter column "default_language" set default 'en';`);

    this.addSql(`alter table "user" add column "phone_number" varchar(255) not null, add column "company" jsonb null, add column "address" jsonb null, add column "website" varchar(255) not null;`);
    this.addSql(`alter table "user" alter column "language" type varchar(255) using ("language"::varchar(255));`);
    this.addSql(`alter table "user" alter column "language" set default 'en';`);
  }

}
