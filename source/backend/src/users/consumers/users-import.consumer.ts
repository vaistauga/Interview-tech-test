import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ON_ACCOUNT_IMPORT_USERS_SEQUENCE, USERS_ANALYSIS_QUEUE, USERS_IMPORT_ERRORS, USERS_QUEUE } from '@api/users/constants';
import { CreateRequestContext, EntityManager } from '@mikro-orm/postgresql';
import { Inject, Logger } from '@nestjs/common';
import { LOGGER } from '@api/shared/logger/constants';
import { Context, Sequence } from '@api/shared/sequence';
import { createQueueLogger, QueueLogger } from '@api/shared/queue';
import { UsersImportRequestDto } from '@api/users/dto';
import { TUserImportError } from '@api/users/types';
import { Account } from '@api/accounts/entities/account.entity';
import { SEQUENCE_ACCOUNT_ID_KEY, SEQUENCE_ENTITY_ID_KEY, SEQUENCE_ENTITY_TYPE_KEY, SEQUENCE_ERROR_KEY, SEQUENCE_TOTAL_USERS_COUNT } from '@api/shared/sequence/constants';

@Processor(UsersImportConsumer.queue)
export class UsersImportConsumer {
  public static readonly queue = USERS_QUEUE;
  public static readonly job = 'users.import';
  private readonly logger = new Logger(UsersImportConsumer.name);

  public constructor(
    private readonly em: EntityManager,
    @Inject(ON_ACCOUNT_IMPORT_USERS_SEQUENCE)
    private readonly sequenceFactory: () => Sequence,
  ) {}

  @OnQueueFailed({
    name: UsersImportConsumer.job,
  })
  public async onError(job: Job, error: Error): Promise<void> {
    const logger = createQueueLogger(this.logger, job);

    await logger.error(error.message, error.stack);
  }

  @Process({
    name: UsersImportConsumer.job,
  })
  public async handle(
    job: Job<{
      fileId: string;
      dto: UsersImportRequestDto;
    }>,
  ): Promise<void> {
    const queueLogger = createQueueLogger(this.logger, job);

    await queueLogger.log('Start importing.');

    const [errors, totalUsersCount] = await this.import(
      queueLogger,
      job.data.fileId,
      job.data.dto,
    );

    if (errors.length > 0) {
      await queueLogger.warn(JSON.stringify(errors));
    }

    await queueLogger.log('Finished importing.');
  }

  @CreateRequestContext()
  private async import(
    logger: QueueLogger,
    fileId: string,
    dto: UsersImportRequestDto,
  ): Promise<[TUserImportError[], number]> {
    const account = await this.em.findOneOrFail(Account, {
      id: dto.accountId,
    });

    const sequence = this.sequenceFactory();

    const context = new Context();
    context.addIndex(LOGGER, logger);
    context.addIndex(SEQUENCE_ACCOUNT_ID_KEY, account.id);
    context.addIndex(SEQUENCE_ENTITY_ID_KEY, account.id);
    context.addIndex(SEQUENCE_ENTITY_TYPE_KEY, Account);
    context.addIndex(USERS_IMPORT_ERRORS, []);
    context.addIndex(SEQUENCE_TOTAL_USERS_COUNT, 0);
    sequence.setContext(context);

    await sequence.start(fileId);

    const error = context.getIndex(SEQUENCE_ERROR_KEY);

    if (!!error) {
      throw error;
    }

    return [
      context.getIndex<TUserImportError[]>(USERS_IMPORT_ERRORS),
      context.getIndex(SEQUENCE_TOTAL_USERS_COUNT),
    ];
  }

} 