import { Controller, Get, Param, ParseUUIDPipe, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Account } from './entities/account.entity';
import { GetAccountsQuery } from './queries/get-accounts.query';
import { GetAccountQuery } from './queries/get-account.query';

@ApiTags('accounts')
@Controller('accounts')
@UseInterceptors(ClassSerializerInterceptor)
export class AccountController {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully', type: [Account] })
  async findAll(): Promise<Account[]> {
    return this.queryBus.execute(new GetAccountsQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully', type: Account })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Account> {
    return this.queryBus.execute(new GetAccountQuery(id));
  }
} 