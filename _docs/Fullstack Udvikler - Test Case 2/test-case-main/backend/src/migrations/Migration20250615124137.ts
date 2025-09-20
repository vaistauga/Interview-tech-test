import { Migration } from '@mikro-orm/migrations';

export class Migration20250615124137 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "branch" drop column "created_at", drop column "updated_at";`);

    this.addSql(`alter table "branch" add column "active" boolean not null default true, add column "created" timestamptz not null, add column "updated" timestamptz not null;`);

    this.addSql(`alter table "group" drop column "created_at", drop column "updated_at";`);

    this.addSql(`alter table "group" add column "active" boolean not null default true, add column "created" timestamptz not null, add column "updated" timestamptz not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "branch" drop column "active", drop column "created", drop column "updated";`);

    this.addSql(`alter table "branch" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`);

    this.addSql(`alter table "group" drop column "active", drop column "created", drop column "updated";`);

    this.addSql(`alter table "group" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`);
  }

}
