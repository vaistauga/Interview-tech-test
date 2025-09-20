import { Collection, Entity,OneToMany, ManyToOne, PrimaryKey, Property, Ref, ManyToMany, LoadStrategy } from '@mikro-orm/core';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { Account } from '@api/accounts/entities';
import { ReferenceToEntity } from '@api/shared/decorators/reference-to-entity.decorator';
import { CollectionToArray } from '@api/shared/decorators';
import { GroupUser } from './group-user.entity';
import { User } from '@api/users/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Group {
  @PrimaryKey({
    type: 'uuid',
    fieldName: 'id',
  })
  public id: string = v4();

  @Property()
  @ApiProperty({ description: 'Group name', example: 'Sales Team' })
  name!: string;

  @Property({
    columnType: 'boolean',
    type: 'boolean',
    default: false,
  })
  @ApiProperty({ description: 'Group auto assign', example: true })
  autoAssign!: boolean;

  @ApiProperty({
    type: () => Account,
  })
  @ReferenceToEntity()
  @ManyToOne(() => Account, {
    ref: true,
    inversedBy: (account: Account) => account.groups,
    strategy: LoadStrategy.JOINED,
    eager: false,
    cascade: [],
    index: true,
    deleteRule: 'cascade',
  })
  account: Ref<Account>;

  @ApiProperty({
    type: () => User,
    isArray: true,
    default: [],
  })
  @CollectionToArray()
  @ManyToMany({
    entity: () => User,
    pivotEntity: () => GroupUser,
    inversedBy: (user: User) => user.groups,
    cascade: [],
  })
  public users: Collection<User> = new Collection<User>(this);

  @ApiHideProperty()
  @Exclude()
  @CollectionToArray()
  @OneToMany({
    entity: () => GroupUser,
    mappedBy: (groupUser: GroupUser) => groupUser.group,
  })
  public usersPivot: Collection<GroupUser> = new Collection<GroupUser>(this);

  @ApiProperty({
    type: 'boolean',
  })
  @Property({
    default: true,
    type: 'boolean',
    columnType: 'boolean',
  })
  active: boolean = true;

  @Property({ onCreate: () => new Date() })
  @ApiProperty({ description: 'Group creation date' })
  created!: Date;

  @Property({ onUpdate: () => new Date(), nullable: true })
  @ApiProperty({ description: 'Group last update date' })
  updated?: Date | null = null;
} 