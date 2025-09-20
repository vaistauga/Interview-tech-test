import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { Language } from '@api/shared/enums';
import { CollectionToArray } from '@api/shared/decorators/collection-to-array.decorator';
import { Branch } from '@api/branch/entities/branch.entity';
import { Group } from '@api/group/entities/group.entity';
import { User } from '@api/users/entities';

@Entity()
export class Account {
  @PrimaryKey({
    type: 'uuid',
    fieldName: 'id',
  })
  public id: string = v4();

  @Property()
  @Unique()
  @ApiProperty({ description: 'Account name', example: 'Company Inc.' })
  name!: string;

  @Property()
  @ApiProperty({ description: 'Account description', example: 'Main company account' })
  description!: string;

  @Property()
  @ApiProperty({ description: 'Account default language', example: 'en' })
  defaultLanguage: Language = Language.EN;

  @Property()
  @ApiProperty({ description: 'Account free trial status', example: true })
  isFreeTrial: boolean = false;

  @Property({ onCreate: () => new Date() })
  @ApiProperty({ description: 'Account creation date' })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @ApiProperty({ description: 'Account last update date' })
  updatedAt: Date = new Date();

  @ApiProperty({
    type: () => Branch,
    isArray: true,
    default: [],
  })
  @CollectionToArray()
  @OneToMany({
    entity: () => Branch,
    cascade: [],
    mappedBy: (branch: Branch) => branch.account,
  })
  branches: Collection<Branch> = new Collection<Branch>(this);

  @ApiProperty({
    type: () => Group,
    isArray: true,
    default: [],
  })
  @CollectionToArray()
  @OneToMany({
    entity: () => Group,
    cascade: [],
    mappedBy: (group: Group) => group.account,
  })
  groups: Collection<Group> = new Collection<Group>(this);

  @ApiProperty({
    type: () => User,
    isArray: true,
    default: [],
  })
  @CollectionToArray()
  @OneToMany({
    entity: () => User,
    mappedBy: (user: User) => user.account,
    cascade: [],
  })
  public users: Collection<User> = new Collection<User>(this);
} 