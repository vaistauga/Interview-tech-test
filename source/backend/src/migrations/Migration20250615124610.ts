import { Migration } from '@mikro-orm/migrations';

export class Migration20250615124610 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "branch" drop column "description";`);

    this.addSql(`alter table "group" drop column "description";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "branch" add column "description" varchar(255) not null;`);

    this.addSql(`alter table "group" add column "description" varchar(255) not null;`);
  }

}
