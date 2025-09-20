import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { SystemRoles } from '../enums';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';
import { CollectionToArray } from '@api/shared/decorators';

@Entity()
export class Role {
  @PrimaryKey({
    type: 'uuid',
    fieldName: 'id',
  })
  public id: string = v4();

  @Property()
  @Unique()
  @ApiProperty({ description: 'Role code', example: 'admin' })
  code!: SystemRoles;

  @Property()
  @ApiProperty({ description: 'Role name', example: 'Administrator' })
  name!: string;

  @Property()
  @ApiProperty({ description: 'Role description', example: 'Full system access' })
  description!: string;

  @Property({ onCreate: () => new Date() })
  @ApiProperty({ description: 'Role creation date' })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @ApiProperty({ description: 'Role last update date' })
  updatedAt: Date = new Date();

  @ApiHideProperty()
  @Exclude()
  @CollectionToArray()
  @OneToMany({
    entity: () => User,
    mappedBy: (user: User) => user.role,
    cascade: [],
  })
  public users: Collection<User> = new Collection<User>(this);
} 