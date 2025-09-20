import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { Group } from './entities';
import { GroupController } from './group.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Group]),
    CqrsModule,
  ],
  controllers: [GroupController],
  providers: [],
  exports: [MikroOrmModule],
})
export class GroupModule {} 