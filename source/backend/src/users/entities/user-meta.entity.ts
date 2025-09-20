import { DateType, Embeddable, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Embeddable()
export class UserMeta {
  @ApiProperty()
  @Property({
    nullable: true,
    default: null,
  })
  public timezone?: string = null;

  @ApiProperty()
  @Property({
    nullable: true,
    default: null,
  })
  public jobTitle?: string = null;

  @ApiProperty()
  @Property({
    nullable: true,
    default: null,
  })
  public department?: string = null;

  @ApiProperty()
  @Property({
    nullable: true,
    default: null,
  })
  public companyName?: string = null;

  @ApiProperty()
  @Property({
    nullable: true,
    default: null,
  })
  public manager?: string = null;

  @ApiProperty()
  @Property({
    nullable: true,
    default: null,
  })
  public managerEmail?: string = null;

  @ApiProperty()
  @Property({
    nullable: true,
    default: null,
  })
  public country?: string = null;

  @ApiProperty()
  @Property({
    nullable: true,
    default: null,
  })
  public mobilePhone?: string = null;

  @ApiProperty()
  @Property({
    nullable: true,
    default: null,
  })
  public officeLocation?: string = null;

  @ApiProperty({
    type: 'boolean',
  })
  @Property({
    nullable: true,
    default: null,
    columnType: 'boolean',
    type: 'boolean',
  })
  public isWelcomeEmailSent?: boolean = false;
  
  @ApiProperty({
    type: 'boolean',
  })
  @Property({
    nullable: true,
    default: null,
    columnType: 'boolean',
    type: 'boolean',
  })
  public changedLanguage?: boolean = false;

  @ApiProperty()
  @Property({
    nullable: true,
    type: DateType,
  })
  public lastLogin?: Date;

  @ApiProperty()
  @Property({
    nullable: true,
    type: DateType,
  })
  public firstLogin?: Date;

  @ApiProperty()
  @Property({
    nullable: true,
  })
  public manuallyDeactivated?: boolean;

  @ApiProperty()
  @Property({
    nullable: true,
  })
  public manuallyDeactivatedBy?: string;

  @ApiProperty()
  @Property({
    nullable: true,
    persist: false,
  })
  public manuallyDeactivatedByUser?: {
    id: string;
    username: string;
    email: string;
    name: string;
  };

  @ApiProperty()
  @Property({
    nullable: true,
  })
  public manuallyDeactivatedOn?: Date;
}
