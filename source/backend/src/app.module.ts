import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bull';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { FilesModule } from './files/files.module';
import { databaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from "@bull-board/nestjs";
import { AccountModule } from './accounts/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    MikroOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD', ''),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    CqrsModule,
    SharedModule,
    UsersModule,
    HealthCheckModule,
    FilesModule,
    AccountModule,
  ],
})
export class AppModule {} 