import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

export enum FileStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export enum FileType {
  USER_IMPORT = 'user_import',
  // Add more file types as needed
}

@Entity()
export class File {
  @PrimaryKey({
    type: 'uuid',
    fieldName: 'id',
  })
  public id: string = v4();

  @Property()
  @ApiProperty({ description: 'Original filename', example: 'users.csv' })
  originalName!: string;

  @Property()
  @ApiProperty({ description: 'File MIME type', example: 'text/csv' })
  mimeType!: string;

  @Property()
  @ApiProperty({ description: 'File size in bytes', example: 1024 })
  size!: number;

  @Property()
  @ApiProperty({ description: 'Storage path on filesystem' })
  storagePath!: string;

  @Enum(() => FileType)
  @ApiProperty({ description: 'File type/purpose', enum: FileType })
  fileType!: FileType;

  @Enum(() => FileStatus)
  @ApiProperty({ description: 'File processing status', enum: FileStatus })
  status: FileStatus = FileStatus.UPLOADED;

  @Property({ nullable: true })
  @ApiProperty({ description: 'Associated job ID for background processing' })
  jobId?: string;

  @Property({ nullable: true })
  @ApiProperty({ description: 'Error message if processing failed' })
  errorMessage?: string;

  @Property({ nullable: true })
  @ApiProperty({ description: 'Processing result metadata' })
  metadata?: any;

  @Property({ onCreate: () => new Date() })
  @ApiProperty({ description: 'File upload date' })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @ApiProperty({ description: 'File last update date' })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  @ApiProperty({ description: 'File expiration date' })
  expiresAt?: Date;
} 