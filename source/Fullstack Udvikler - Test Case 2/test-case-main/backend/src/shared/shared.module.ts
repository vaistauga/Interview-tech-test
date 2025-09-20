import { Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { QueueLogger } from '@api/shared/queue';
import { LOGGER } from './logger/constants';

@Module({
  providers: [
    {
      provide: LOGGER,
      useClass: Logger,
    },
    QueueLogger,
  ],
  exports: [LOGGER, QueueLogger],
})
export class SharedModule {} 