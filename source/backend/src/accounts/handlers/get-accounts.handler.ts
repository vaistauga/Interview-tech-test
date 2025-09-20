import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { GetAccountsQuery } from '../queries/get-accounts.query';
import { Account } from '../entities/account.entity';

@QueryHandler(GetAccountsQuery)
export class GetAccountsHandler implements IQueryHandler<GetAccountsQuery> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: EntityRepository<Account>,
  ) {}

  async execute(): Promise<Account[]> {
    return this.accountRepository.findAll({
      orderBy: { name: 'ASC' },
    });
  }
} 