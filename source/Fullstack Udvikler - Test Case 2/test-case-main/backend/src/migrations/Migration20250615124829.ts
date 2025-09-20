import { Migration } from '@mikro-orm/migrations';

export class Migration20250615124829 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "branch" alter column "updated" type timestamptz using ("updated"::timestamptz);`);
    this.addSql(`alter table "branch" alter column "updated" drop not null;`);

    this.addSql(`alter table "group" alter column "updated" type timestamptz using ("updated"::timestamptz);`);
    this.addSql(`alter table "group" alter column "updated" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "branch" alter column "updated" type timestamptz using ("updated"::timestamptz);`);
    this.addSql(`alter table "branch" alter column "updated" set not null;`);

    this.addSql(`alter table "group" alter column "updated" type timestamptz using ("updated"::timestamptz);`);
    this.addSql(`alter table "group" alter column "updated" set not null;`);
  }

}
