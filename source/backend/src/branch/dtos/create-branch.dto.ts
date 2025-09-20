import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ description: 'Branch name', example: 'New York Office' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Branch description', example: 'New York office location' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Account ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  accountId!: string;
} 