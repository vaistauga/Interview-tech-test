import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

import { GetUsersQuery } from '../queries/get-users.query';
import { User } from '../entities/user.entity';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async execute(query: GetUsersQuery): Promise<User[]> {
    const { limit, offset, accountId } = query;

    return this.userRepository.findAll({
      limit: limit || 50,
      offset,
      orderBy: { createdAt: 'DESC' },
      where: accountId ? { account: { id: accountId } } : {},
      populate: ['account', 'branch', 'groups', 'role'],
    });
  }
} 