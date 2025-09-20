import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { DeleteUserCommand } from '../commands';
import { User } from '../entities/user.entity';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly em: EntityManager,) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { id } = command;
    const user = await this.em.findOneOrFail(User, { id });

    await this.em.removeAndFlush(user);
  }
} 