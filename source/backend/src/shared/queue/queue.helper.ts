import { Logger } from '@nestjs/common';
import { Job, JobOptions, Queue } from 'bull';
import { omit } from 'lodash';
import { QueueLogger } from './queue.logger';

export const defaultQueueOptions: JobOptions = {
  attempts: 3,
  removeOnComplete: 50,
  removeOnFail: 100,
  backoff: {
    delay: 300000,
    type: 'exponential',
  },
  timeout: 1000 * 60 * 60 * 8, // if the job takes longer than 8 hours, it will be marked as failed
};

export const createQueue = async <T>(
  queue: Queue,
  name: string,
  payload: T,
  options: JobOptions = defaultQueueOptions,
  callbacks: {
    before: (queue: Queue, name: string, payload: unknown) => Promise<void>;
  } = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    before: async () => {},
  },
): Promise<Job> => {
  await callbacks.before(queue, name, payload);
  return await queue.add(name, payload, options);
};

export const createQueueLogger = <T>(
  logger: Logger,
  job: Job<T>,
): QueueLogger => {
  return new QueueLogger(logger, job);
};

export const configureGlobalApiQueueErrorHandler = (queue: Queue) => {
  queue.on('failed', async (job) => {
    await job.discard();
    await job.remove();

    await queue.add(job.name, job.data, omit(job.opts, ['id']));
  });
};

export const cleanDelayedJobs = async (
  queue: Queue,
  jobProcessors: { job: string; cron?: string }[],
) => {
  const delayed = await queue.getDelayed();

  if (delayed.length === 0) {
    return;
  }

  for (const job of delayed) {
    const cron = job.opts?.repeat
      ? job.opts?.repeat?.key?.split(':').pop()
      : null;

    if (
      jobProcessors.some(
        (processor) =>
          processor.job === job.name &&
          processor.cron &&
          job.opts?.repeat &&
          processor.cron !== cron,
      )
    ) {
      await job.remove();
    }
  }
};
