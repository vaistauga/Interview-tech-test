import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ON_ACCOUNT_IMPORT_USERS_VALIDATION_SEQUENCE, USERS_ANALYSIS_QUEUE } from '@api/users/constants';
import { CreateRequestContext, EntityManager } from '@mikro-orm/postgresql';
import { Inject, Logger } from '@nestjs/common';
import { LOGGER } from '@api/shared/logger/constants';
import { Context, Sequence } from '@api/shared/sequence';
import { createQueueLogger, QueueLogger } from '@api/shared/queue';
import { UsersImportRequestDto } from '@api/users/dto';
import {  SEQUENCE_ERROR_KEY, SEQUENCE_TOTAL_NEW_USERS_COUNT, SEQUENCE_TOTAL_USERS_COUNT } from '@api/shared/sequence/constants';

class jobResult{
  totalUserRows: number;
  newUsers: number;
}


@Processor(UsersAnalysisConsumer.queue)
export class UsersAnalysisConsumer {
  public static readonly queue = USERS_ANALYSIS_QUEUE;
  public static readonly job = 'users.file_import';
  private readonly logger = new Logger(UsersAnalysisConsumer.name);

  public constructor(
    private readonly em: EntityManager,
    @Inject(ON_ACCOUNT_IMPORT_USERS_VALIDATION_SEQUENCE)
    private readonly sequenceFactory: () => Sequence,
  ) {}

  @OnQueueFailed({
    name: UsersAnalysisConsumer.job,
  })
  public async onError(job: Job, error: Error): Promise<void> {
    const logger = createQueueLogger(this.logger, job);

    await logger.error(error.message, error.stack);
  }

  @Process({
    name: UsersAnalysisConsumer.job,
  })
  public async handle(
    job: Job<{
      fileId: string;
      dto: UsersImportRequestDto;
    }>,
  ): Promise<jobResult> {
    const queueLogger = createQueueLogger(this.logger, job);

    await queueLogger.log('Start importing.');

    const [totalUsersCount, newUsersCount] = await this.analyze(
      queueLogger,
      job.data.fileId,
    );

    await queueLogger.log('Finished importing.');
    const result = new jobResult();
    result.totalUserRows = totalUsersCount;
    result.newUsers = newUsersCount;
    return result;
  }

  @CreateRequestContext()
  private async analyze(
    logger: QueueLogger,
    fileId: string,
  ): Promise<[number, number]> {
    const sequence = this.sequenceFactory();

    const context = new Context();
    context.addIndex(LOGGER, logger);
    context.addIndex(SEQUENCE_TOTAL_USERS_COUNT, 0);
    context.addIndex(SEQUENCE_TOTAL_NEW_USERS_COUNT, 0);
    sequence.setContext(context);

    await sequence.start(fileId);

    const error = context.getIndex(SEQUENCE_ERROR_KEY);

    if (!!error) {
      throw error;
    }

    return [
      context.getIndex(SEQUENCE_TOTAL_USERS_COUNT),
      context.getIndex(SEQUENCE_TOTAL_NEW_USERS_COUNT),
    ];
  }

} 