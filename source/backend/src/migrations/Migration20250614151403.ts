import { Migration } from '@mikro-orm/migrations';

export class Migration20250614151403 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "account" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, "default_language" varchar(255) not null default 'en', "is_free_trial" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "account_pkey" primary key ("id"));`);
    this.addSql(`alter table "account" add constraint "account_name_unique" unique ("name");`);

    this.addSql(`create table "branch" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, "account_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "branch_pkey" primary key ("id"));`);
    this.addSql(`create index "branch_account_id_index" on "branch" ("account_id");`);

    this.addSql(`create table "group" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, "auto_assign" boolean not null, "account_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "group_pkey" primary key ("id"));`);
    this.addSql(`create index "group_account_id_index" on "group" ("account_id");`);

    this.addSql(`create table "role" ("id" uuid not null, "code" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "role_pkey" primary key ("id"));`);
    this.addSql(`alter table "role" add constraint "role_code_unique" unique ("code");`);

    this.addSql(`create table "user_groups" ("user_id" uuid not null, "group_id" uuid not null, constraint "user_groups_pkey" primary key ("user_id", "group_id"));`);

    this.addSql(`alter table "branch" add constraint "branch_account_id_foreign" foreign key ("account_id") references "account" ("id") on delete cascade;`);

    this.addSql(`alter table "group" add constraint "group_account_id_foreign" foreign key ("account_id") references "account" ("id") on delete cascade;`);

    this.addSql(`alter table "user_groups" add constraint "user_groups_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_groups" add constraint "user_groups_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user" add column "account_id" uuid not null, add column "branch_id" uuid null, add column "role_id" uuid not null, add column "language" varchar(255) not null default 'en', add column "origin" varchar(255) not null default 'default', add column "free_trial_ends_at" timestamptz null, add column "meta" jsonb null;`);
    this.addSql(`alter table "user" add constraint "user_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;`);
    this.addSql(`alter table "user" add constraint "user_branch_id_foreign" foreign key ("branch_id") references "branch" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "branch" drop constraint "branch_account_id_foreign";`);

    this.addSql(`alter table "group" drop constraint "group_account_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_account_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_branch_id_foreign";`);

    this.addSql(`alter table "user_groups" drop constraint "user_groups_group_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_role_id_foreign";`);

    this.addSql(`drop table if exists "account" cascade;`);

    this.addSql(`drop table if exists "branch" cascade;`);

    this.addSql(`drop table if exists "group" cascade;`);

    this.addSql(`drop table if exists "role" cascade;`);

    this.addSql(`drop table if exists "user_groups" cascade;`);

    this.addSql(`alter table "user" drop column "account_id", drop column "branch_id", drop column "role_id", drop column "language", drop column "origin", drop column "free_trial_ends_at", drop column "meta";`);
  }

}
