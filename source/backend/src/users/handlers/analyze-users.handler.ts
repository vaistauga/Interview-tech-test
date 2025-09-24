import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileType } from '@api/files/entities/file.entity';
import { FileService } from '@api/files/services/file.service';
import { createQueue } from '@api/shared/queue';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { UsersImportConsumer } from '../consumers/users-import.consumer';
import { AnalyzeUsersCommand } from '../commands';
import { UsersAnalysisConsumer } from '../consumers/users-analysis.consumer';

@CommandHandler(AnalyzeUsersCommand)
export class AnalyzeUsersHandler implements ICommandHandler<AnalyzeUsersCommand> {
  constructor(
    private readonly fileService: FileService,
    @InjectQueue(UsersAnalysisConsumer.queue)
    private readonly queue: Queue,
  ) {}

  async execute(
    {file, dto}: AnalyzeUsersCommand
  ): Promise<string|number> {
    // Store the file
    const uploadedFile = await this.fileService.createFile({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      fileType: FileType.USER_IMPORT,
      expirationHours: 48, // Keep import files for 48 hours
    });
    
   var job = await createQueue(this.queue, UsersAnalysisConsumer.job, {fileId: uploadedFile.id, dto});
   return job.id.valueOf();
  }
} 