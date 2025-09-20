import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { UserAddressDto } from './user-address.dto';
import { UserCompanyDto } from './user-company.dto';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User username', example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'User phone number', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'User website', example: 'https://www.example.com' })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ description: 'User company', example: { name: 'Company Inc.' } })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  company?: UserCompanyDto;

  @ApiProperty({ description: 'User address', example: { city: 'New York', zip: '10001' } })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  address?: UserAddressDto;
} 