import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserCompanyDto {
  @ApiProperty({ description: 'User company name', example: 'Company Inc.' })
  @IsString()
  @IsOptional()
  name?: string;
}