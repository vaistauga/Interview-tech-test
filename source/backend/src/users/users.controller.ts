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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';
import { DeleteUserCommand, ImportUsersCommand } from './commands';
import { GetUserQuery, GetUsersQuery } from './queries';
import { UsersImportRequestDto } from './dto';
import { UsersImportRequestResponseDto } from './dto/users-import-request-response.dto';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [User] })
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
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: User })
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
  @ApiOperation({ summary: 'Import users from file (asynchronous)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', format: 'uuid' },
        file: { type: 'string', format: 'binary' },
      }
    }
  })
  @ApiResponse({ status: 201, description: 'User import job started successfully', type: UsersImportRequestResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async importUsers(
    @Body() dto: UsersImportRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UsersImportRequestResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    const isValidType = allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(csv|xlsx|xls)$/i);

    if (!isValidType) {
      throw new BadRequestException('Invalid file type. Please upload CSV or Excel files only.');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 10MB.');
    }

    try {
      const result = await this.commandBus.execute<ImportUsersCommand, UsersImportRequestResponseDto>(
        new ImportUsersCommand(file, dto),
      );
      return result;
    } catch (error) {
      throw new BadRequestException(`Failed to process file: ${error.message}`);
    }
  }
} 