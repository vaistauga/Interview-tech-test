import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Branch } from './entities';
import { CreateBranchDto } from './dtos';

@ApiTags('Branches')
@Controller('branches')
export class BranchController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({ status: 201, description: 'Branch created successfully', type: Branch })
  async create(@Body() createBranchDto: CreateBranchDto): Promise<Branch> {
    // TODO: Implement create branch command
    throw new Error('Not implemented');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a branch by ID' })
  @ApiResponse({ status: 200, description: 'Branch found', type: Branch })
  async findOne(@Param('id') id: string): Promise<Branch> {
    // TODO: Implement get branch query
    throw new Error('Not implemented');
  }
} 