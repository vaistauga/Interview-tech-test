import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserAddressDto {
  @ApiProperty({ description: 'User city', example: 'New York' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'User zip', example: '10001' })
  @IsString()
  @IsOptional()
  zip?: string;
}