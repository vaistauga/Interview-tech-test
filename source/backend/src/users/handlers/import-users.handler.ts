import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImportUsersCommand } from '../commands/import-users.command';
import { FileType } from '@api/files/entities/file.entity';
import { FileService } from '@api/files/services/file.service';
import { createQueue } from '@api/shared/queue';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { UsersImportConsumer } from '../consumers/users-import.consumer';

@CommandHandler(ImportUsersCommand)
export class ImportUsersHandler implements ICommandHandler<ImportUsersCommand> {
  constructor(
    private readonly fileService: FileService,
    @InjectQueue(UsersImportConsumer.queue)
    private readonly queue: Queue,
  ) {}

  async execute(
    dto: ImportUsersCommand
  ): Promise<void> {
    await createQueue(this.queue, UsersImportConsumer.job, { fileId: dto.fileId, dto });
  }
} 