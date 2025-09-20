import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ description: 'Group name', example: 'Sales Team' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Group description', example: 'Sales team members' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Account ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  accountId!: string;
} 