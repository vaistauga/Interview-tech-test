import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { Branch } from './entities';
import { BranchController } from './branch.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Branch]),
    CqrsModule,
  ],
  controllers: [BranchController],
  providers: [],
  exports: [MikroOrmModule],
})
export class BranchModule {} 