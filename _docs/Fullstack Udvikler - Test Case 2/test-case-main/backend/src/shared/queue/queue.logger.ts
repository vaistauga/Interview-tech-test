import { Logger } from '@nestjs/common';
import { Job } from 'bull';

export class QueueLogger extends Logger {
  public constructor(
    private readonly logger: Logger,
    private readonly job: Job,
  ) {
    super();
  }

  public async log(message: string): Promise<void> {
    this.logger.log(message);
    await this.job.log(message);
  }

  public async error(message: string, trace?: string): Promise<void> {
    this.logger.error(message, trace);

    await this.job.log(`Error: ${message} | Trace: ${trace}`);
  }

  public async warn(message: string): Promise<void> {
    this.logger.warn(message);

    await this.job.log(`Warn: ${message}`);
  }
}
