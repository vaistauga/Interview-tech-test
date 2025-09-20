import { Migration } from '@mikro-orm/migrations';

export class Migration20250612150848 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "file" ("id" uuid not null, "original_name" varchar(255) not null, "mime_type" varchar(255) not null, "size" int not null, "storage_path" varchar(255) not null, "file_type" text check ("file_type" in ('user_import')) not null, "status" text check ("status" in ('uploaded', 'processing', 'processed', 'failed', 'expired')) not null default 'uploaded', "job_id" varchar(255) null, "error_message" varchar(255) null, "metadata" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "expires_at" timestamptz null, constraint "file_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "file" cascade;`);
  }

}
