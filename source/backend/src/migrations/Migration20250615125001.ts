import { Migration } from '@mikro-orm/migrations';

export class Migration20250615125001 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "group" alter column "auto_assign" type boolean using ("auto_assign"::boolean);`);
    this.addSql(`alter table "group" alter column "auto_assign" set default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "group" alter column "auto_assign" drop default;`);
    this.addSql(`alter table "group" alter column "auto_assign" type boolean using ("auto_assign"::boolean);`);
  }

}
