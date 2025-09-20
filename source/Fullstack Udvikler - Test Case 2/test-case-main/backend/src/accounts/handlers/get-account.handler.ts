import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import { GetAccountQuery } from '../queries/get-account.query';
import { Account } from '../entities/account.entity';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler implements IQueryHandler<GetAccountQuery> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: EntityRepository<Account>,
  ) {}

  async execute(query: GetAccountQuery): Promise<Account> {
    const { id } = query;
    const account = await this.accountRepository.findOne(id);
    
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }
} 