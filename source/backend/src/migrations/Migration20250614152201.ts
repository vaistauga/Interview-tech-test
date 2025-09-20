import { Migration } from '@mikro-orm/migrations';

export class Migration20250614152201 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "group_user" ("group_id" uuid not null, "user_id" uuid not null, "joined_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "group_user_pkey" primary key ("group_id", "user_id"));`);
    this.addSql(`create index "group_user_group_id_index" on "group_user" ("group_id");`);
    this.addSql(`create index "group_user_user_id_index" on "group_user" ("user_id");`);
    this.addSql(`create index "group_user_joined_at_index" on "group_user" ("joined_at");`);

    this.addSql(`alter table "group_user" add constraint "group_user_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "group_user" add constraint "group_user_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "user_groups" cascade;`);

    this.addSql(`alter table "user" drop constraint "user_account_id_foreign";`);
    this.addSql(`alter table "user" drop constraint "user_branch_id_foreign";`);

    this.addSql(`alter table "user" add constraint "user_account_id_foreign" foreign key ("account_id") references "account" ("id") on delete cascade;`);
    this.addSql(`alter table "user" add constraint "user_branch_id_foreign" foreign key ("branch_id") references "branch" ("id") on delete cascade;`);
    this.addSql(`create index "user_account_id_index" on "user" ("account_id");`);
    this.addSql(`create index "user_branch_id_index" on "user" ("branch_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "user_groups" ("user_id" uuid not null, "group_id" uuid not null, constraint "user_groups_pkey" primary key ("user_id", "group_id"));`);

    this.addSql(`alter table "user_groups" add constraint "user_groups_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_groups" add constraint "user_groups_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "group_user" cascade;`);

    this.addSql(`alter table "user" drop constraint "user_account_id_foreign";`);
    this.addSql(`alter table "user" drop constraint "user_branch_id_foreign";`);

    this.addSql(`drop index "user_account_id_index";`);
    this.addSql(`drop index "user_branch_id_index";`);

    this.addSql(`alter table "user" add constraint "user_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;`);
    this.addSql(`alter table "user" add constraint "user_branch_id_foreign" foreign key ("branch_id") references "branch" ("id") on update cascade on delete set null;`);
  }

}
