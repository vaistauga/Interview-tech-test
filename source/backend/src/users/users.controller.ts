import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  ParseUUIDPipe,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from './entities/user.entity';
import {
  DeleteUserCommand,
  ImportUsersCommand,
  AnalyzeUsersCommand,
} from './commands';
import { GetUserQuery, GetUsersQuery } from './queries';
import { UsersImportRequestDto, UsersFileUploadRequestDto, JobStatusResponseDto } from './dto';
import { UsersAnalysisConsumer } from './consumers/users-analysis.consumer';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectQueue(UsersAnalysisConsumer.queue)
    private readonly analysisQueue: Queue,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [User],
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'accountId', required: false, type: String })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('accountId') accountId?: string,
  ): Promise<User[]> {
    const query = new GetUsersQuery(limit, offset, accountId);
    return this.queryBus.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const query = new GetUserQuery(id);
    return this.queryBus.execute(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const command = new DeleteUserCommand(id);
    return this.commandBus.execute(command);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import users (asynchronous)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', format: 'uuid' },
        fileId: { type: 'string', format: 'string' },
      },
      required: ['accountId', 'fileId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User import job started successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async importUsers(
    @Body() dto: UsersImportRequestDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.commandBus.execute(new ImportUsersCommand(dto.fileId, dto));

      return {
        success: true,
        message:
          'A queue was created to import the users in account.',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to process import: ${error.message}`);
    }
  }

  @Post('import-file-upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import users from file (asynchronous)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', format: 'uuid' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User file imported successfully',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async analyzeUsersFile(
    @Body() dto: UsersFileUploadRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ jobId: string; success: boolean; message: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    const isValidType =
      allowedTypes.includes(file.mimetype) ||
      file.originalname.match(/\.(csv|xlsx|xls)$/i);

    if (!isValidType) {
      throw new BadRequestException(
        'Invalid file type. Please upload CSV or Excel files only.',
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'File size too large. Maximum size is 10MB.',
      );
    }

    try {
      const jobId = await this.commandBus.execute(
        new AnalyzeUsersCommand(file, dto),
      );

      return {
        jobId: jobId.toString(),
        message:
          'A queue was created to import the users file in account. You can get notified, when its finished from the server sent events.',
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to process file: ${error.message}`);
    }
  }

  @Get('import-file-upload/:jobId')
  @ApiOperation({ summary: 'Get status and result of user analysis job' })
  @ApiResponse({
    status: 200,
    description: 'Job status retrieved successfully',
    type: JobStatusResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getAnalysisJobStatus(
    @Param('jobId') jobId: string,
  ): Promise<JobStatusResponseDto> {
    const job = await this.analysisQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    const response = new JobStatusResponseDto();
    response.jobId = job.id.toString();
    response.createdAt = new Date(job.timestamp);
    response.progress = job.progress();

    // Determine job status
    const isCompleted = await job.isCompleted();
    const isFailed = await job.isFailed();
    const isActive = await job.isActive();
    const isWaiting = await job.isWaiting();
    const isDelayed = await job.isDelayed();
    const isStuck = await job.isStuck();

    if (isCompleted) {
      response.status = 'completed';
      response.result = job.returnvalue;
      response.finishedAt = job.finishedOn
        ? new Date(job.finishedOn)
        : undefined;
    } else if (isFailed) {
      response.status = 'failed';
      response.error = job.failedReason;
      response.finishedAt = job.finishedOn
        ? new Date(job.finishedOn)
        : undefined;
    } else if (isActive) {
      response.status = 'active';
    } else if (isDelayed) {
      response.status = 'delayed';
    } else if (isStuck) {
      response.status = 'stalled';
    } else if (isWaiting) {
      response.status = 'waiting';
    } else {
      response.status = 'unknown';
    }

    return response;
  }
}
