import { Entity, LoadStrategy, PrimaryKey, Property, ManyToOne, Ref, OneToMany, Collection } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { Account } from '@api/accounts/entities';
import { ReferenceToEntity } from '@api/shared/decorators/reference-to-entity.decorator';
import { CollectionToArray } from '@api/shared/decorators';
import { User } from '@api/users/entities';

@Entity()
export class Branch {
  @PrimaryKey({
    type: 'uuid',
    fieldName: 'id',
  })
  public id: string = v4();

  @Property()
  @ApiProperty({ description: 'Branch name', example: 'New York Office' })
  name!: string;

  @ApiProperty({
    type: () => Account,
  })
  @ReferenceToEntity()
  @ManyToOne(() => Account, {
    ref: true,
    inversedBy: (account: Account) => account.branches,
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
  @OneToMany({
    entity: () => User,
    mappedBy: (user: User) => user.branch,
    cascade: [],
  })
  public users: Collection<User> = new Collection<User>(this);

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
  @ApiProperty({ description: 'Branch creation date' })
  created!: Date;

  @Property({ onUpdate: () => new Date(), nullable: true })
  @ApiProperty({ description: 'Branch last update date' })
  updated?: Date | null = null;
} 