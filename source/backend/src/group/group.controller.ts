import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Group } from './entities';
import { CreateGroupDto } from './dtos';

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully', type: Group })
  async create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    // TODO: Implement create group command
    throw new Error('Not implemented');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiResponse({ status: 200, description: 'Group found', type: Group })
  async findOne(@Param('id') id: string): Promise<Group> {
    // TODO: Implement get group query
    throw new Error('Not implemented');
  }
} 