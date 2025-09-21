import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { UsersController } from '../../src/users/users.controller';
import { ImportUsersCommand } from '../../src/users/commands';
import { UsersImportRequestDto } from '../../src/users/dto';

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
  let commandBus: CommandBus;

  const mockCommandBus = {
    execute: jest.fn(),
  };

  const mockQueryBus = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('importUsers', () => {
    it('should successfully import users from a CSV file', async () => {
      // Arrange


      const dto: UsersImportRequestDto = {
        accountId: '550e8400-e29b-41d4-a716-446655440000',
      };

      mockCommandBus.execute.mockResolvedValue(undefined);

      // Act
      const result = await controller.importUsers(dto, mockFile);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toContain('queue was created to import the users');
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(ImportUsersCommand),
      );
      expect(commandBus.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when no file is provided', async () => {
      // Arrange
      const dto: UsersImportRequestDto = {
        accountId: '550e8400-e29b-41d4-a716-446655440000',
      };

      // Act & Assert
      await expect(controller.importUsers(dto, null)).rejects.toThrow(
        new BadRequestException('No file provided')
      );
      expect(commandBus.execute).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid file type', async () => {
      // Arrange
      const mockInvalidFile = {
        originalname: 'invalid.txt',
        mimetype: 'text/plain',
        size: 1024,
        buffer: Buffer.from('some text content'),
      } as Express.Multer.File;

      const dto: UsersImportRequestDto = {
        accountId: '550e8400-e29b-41d4-a716-446655440000',
      };

      // Act & Assert
      await expect(controller.importUsers(dto, mockInvalidFile)).rejects.toThrow(
        new BadRequestException('Invalid file type. Please upload CSV or Excel files only.')
      );
      expect(commandBus.execute).not.toHaveBeenCalled();
    });
  });
});
