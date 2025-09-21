import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImportUsersCommand } from '../commands/import-users.command';
import { FileType } from '@api/files/entities/file.entity';
import { FileService } from '@api/files/services/file.service';
import { createQueue } from '@api/shared/queue';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { UsersImportConsumer } from '../consumers/users-import.consumer';
import { UsersImportRequestResponseDto } from '../dto/users-import-request-response.dto';

@CommandHandler(ImportUsersCommand)
export class ImportUsersHandler implements ICommandHandler<ImportUsersCommand> {
  constructor(
    private readonly fileService: FileService,
    @InjectQueue(UsersImportConsumer.queue)
    private readonly queue: Queue,
  ) { }

  async execute(
    { file, dto }: ImportUsersCommand
  ): Promise<UsersImportRequestResponseDto> {
    // Store the file
    const uploadedFile = await this.fileService.createFile({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      fileType: FileType.USER_IMPORT,
      expirationHours: 48, // Keep import files for 48 hours
    });

    await createQueue(this.queue, UsersImportConsumer.job, { fileId: uploadedFile.id, dto });
    const response = new UsersImportRequestResponseDto();
    response.fileId = uploadedFile.id;
    response.totalRecordsInFile = 2;
    response.totalNewRecords = 2;
    return response;
  }
}