import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';
import { getQueueToken } from '@nestjs/bull';
import { UsersController } from '../../src/users/users.controller';
import { UsersImportRequestDto } from '../../src/users/dto';
import { ImportUsersHandler } from '../../src/users/handlers';
import { FileService } from '../../src/files/services/file.service';
import { USERS_QUEUE } from '../../src/users/constants';

// Mock the createQueue function
jest.mock('../../src/shared/queue/queue.helper', () => ({
  createQueue: jest.fn().mockImplementation(async (queue, name, payload) => {
    return await queue.add(name, payload);
  }),
}));

function createMockCsvBuffer(): Buffer {
  return Buffer.from('firstName,lastName,email\nJohn,Doe,john@example.com\nJane,Smith,jane@example.com');
}

const mockFile = {
  originalname: 'test-users.csv',
  mimetype: 'text/csv',
  size: 2048,
  buffer: createMockCsvBuffer(),
} as Express.Multer.File;

describe('UsersController - Import', () => {
  let controller: UsersController;

  const mockFileService = {
    createFile: jest.fn().mockResolvedValue({
      id: 'test-file-id',
    }),
  };

  const mockQueue = {
    add: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [UsersController],
      providers: [
        ImportUsersHandler,
        {
          provide: FileService,
          useValue: mockFileService,
        },
        {
          provide: getQueueToken(USERS_QUEUE),
          useValue: mockQueue,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    
    // Initialize the CQRS module to register handlers
    await module.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('importUsers', () => {
    it('should return file id, total records in file, and total new records', async () => {
      // Arrange
      const dto: UsersImportRequestDto = {
        accountId: '550e8400-e29b-41d4-a716-446655440000',
      };

      // Act
      const result = await controller.importUsers(dto, mockFile);

      // Assert
      expect(typeof result.fileId).toBe('string');
      expect(result.totalRecordsInFile).toBe(2);
      expect(result.totalNewRecords).toBe(2);
      expect(mockFileService.createFile).toHaveBeenCalledWith({
        buffer: mockFile.buffer,
        originalName: mockFile.originalname,
        mimeType: mockFile.mimetype,
        size: mockFile.size,
        fileType: expect.any(String),
        expirationHours: 48,
      });
      expect(mockQueue.add).toHaveBeenCalledWith(
        expect.any(String),
        {
          fileId: 'test-file-id',
          dto,
        }
      );
    });
  });
});
