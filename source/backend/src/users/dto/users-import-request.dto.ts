import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UsersImportRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  public accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  public fileId: string;
}
