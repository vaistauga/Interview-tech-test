import { UserRolesImportAllowedConstraint } from '@api/users/constraints';
import { Language } from '@api/shared/enums';
import { SystemRoles } from '@api/users/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { IsNumberOrString } from '@api/shared/constraints';
import {
  usernameValidationRegex,
  usernameValidationRegexMessage,
} from '@api/users/constants';

export class UserImportDto {
  @ApiProperty({
    required: true,
  })
  @Matches(usernameValidationRegex, {
    message: usernameValidationRegexMessage,
  })
  @IsNotEmpty()
  public username?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public firstName?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public lastName?: string;

  @ApiProperty({
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public email?: string;

  @ApiProperty({
    required: false,
    enum: Language,
  })
  @IsEnum(Language)
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public language?: Language;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? Boolean(value) : undefined))
  public active?: boolean;

  @ApiProperty({
    required: false,
  })
  @Validate(UserRolesImportAllowedConstraint)
  @IsEnum(SystemRoles)
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public role?: SystemRoles;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public goPhishPosition?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public jobTitle?: string;

  @ApiProperty({
    required: false,
  })
  @Validate(IsNumberOrString)
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public department?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public companyName?: string;

  @ApiProperty({
    required: false,
  })
  @Validate(IsNumberOrString)
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public manager?: string;

  @ApiProperty({
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public managerEmail?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public country?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public mobilePhone?: string;

  @ApiProperty({
    required: false,
  })
  @Validate(IsNumberOrString)
  @IsOptional()
  @Transform(({ value }) => (isNotEmpty(value) ? value : undefined))
  public officeLocation?: string;
}
