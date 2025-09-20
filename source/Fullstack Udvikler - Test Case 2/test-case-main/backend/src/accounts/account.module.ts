import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Account } from './entities/account.entity';
import { AccountController } from './account.controller';
import { GetAccountsHandler, GetAccountHandler } from './handlers';

const queryHandlers = [GetAccountsHandler, GetAccountHandler];

@Module({
  imports: [
    MikroOrmModule.forFeature([Account]),
    CqrsModule,
  ],
  controllers: [AccountController],
  providers: [...queryHandlers],
  exports: [],
})
export class AccountModule {}