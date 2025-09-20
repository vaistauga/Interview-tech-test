import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from '@api/users/users.controller';
import { User } from '@api/users/entities/user.entity';
import {
  DeleteUserHandler,
  ImportUsersHandler,
  GetUserHandler,
  GetUsersHandler,
} from './handlers';
import { FilesModule } from '@api/files/files.module';
import { ImportUsersFileReaderFactory } from '@api/users/factories';
import { ExcelParserService } from '@api/shared/services';
import { CsvImportUsersFileReader, ExcelImportUsersFileReader } from './import-users-file-readers';
import { onAccountImportSequenceProvider } from './steps/providers';
import { GroupModule } from '@api/group/group.module';
import { BranchModule } from '@api/branch/branch.module';
import { UsersImportConsumer } from './consumers/users-import.consumer';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { USERS_QUEUE } from './constants';

const commandHandlers = [DeleteUserHandler, ImportUsersHandler];
const queryHandlers = [GetUserHandler, GetUsersHandler];
const steps = [
  {
    provide: ImportUsersFileReaderFactory,
    inject: [ExcelParserService],
    useFactory: (excelParserService: ExcelParserService) => {
      return new ImportUsersFileReaderFactory([
        new CsvImportUsersFileReader(),
        new ExcelImportUsersFileReader(excelParserService),
      ]);
    },
  },
  onAccountImportSequenceProvider,
];
const services = [ExcelParserService];
const consumers = [UsersImportConsumer];

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    CqrsModule,
    FilesModule,
    GroupModule,
    BranchModule,
    BullModule.registerQueue({
      name: USERS_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: UsersImportConsumer.queue,
      adapter: BullAdapter,
    }),
  ],
  controllers: [UsersController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...services,
    ...steps,
    ...consumers,
  ],
  exports: [],
})
export class UsersModule {} 