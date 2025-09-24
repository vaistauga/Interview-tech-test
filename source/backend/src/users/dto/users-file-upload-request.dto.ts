import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UsersFileUploadRequestDto {
  @ApiProperty({
    description: 'The account ID to import users into',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  public accountId: string;
}