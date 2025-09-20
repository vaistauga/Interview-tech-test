import { Collection, Embedded, Entity, LoadStrategy, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, Ref, Reference, Unique } from '@mikro-orm/core';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { v4 } from 'uuid';
import { UserCompany } from './user-company.entity';
import { UserAddress } from './user-address.entity';
import { Account } from '@api/accounts/entities';
import { Group, GroupUser } from '@api/group/entities';
import { Branch } from '@api/branch/entities';
import { Role } from './role.entity';
import { Language } from '@api/shared/enums';
import { UserOrigin } from '../enums';
import { ReferenceToEntity } from '@api/shared/decorators/reference-to-entity.decorator';
import { CollectionToArray } from '@api/shared/decorators';
import { UserMeta } from './user-meta.entity';

@Entity()
export class User {
  @PrimaryKey({
    type: 'uuid',
    fieldName: 'id',
  })
  public id: string = v4();

  @Property()
  @Unique()
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email!: string;

  @Property()
  @Unique()
  @ApiProperty({ description: 'User username', example: 'johndoe' })
  username!: string;

  @Property()
  @ApiProperty({ description: 'User first name', example: 'John' })
  firstName!: string;

  @Property()
  @ApiProperty({ description: 'User last name', example: 'Doe' })
  lastName!: string;

  @Property()
  @Exclude()
  password!: string;

  @Property({ default: true })
  @ApiProperty({ description: 'User active status', example: true })
  isActive: boolean = true;

  @Property({ onCreate: () => new Date() })
  @ApiProperty({ description: 'User creation date' })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @ApiProperty({ description: 'User last update date' })
  updatedAt: Date = new Date();

  @ApiProperty({
    type: () => Account,
    nullable: false,
  })
  @ReferenceToEntity()
  @ManyToOne(() => Account, {
    ref: true,
    inversedBy: (account: Account) => account.users,
    strategy: LoadStrategy.JOINED,
    eager: false,
    cascade: [],
    index: true,
    deleteRule: 'cascade',
  })
  public account: Ref<Account>;

  @ApiProperty({
    type: () => Group,
    isArray: true,
    default: [],
  })
  @CollectionToArray()
  @ManyToMany({
    entity: () => Group,
    pivotEntity: () => GroupUser,
    mappedBy: (group: Group) => group.users,
    cascade: [],
  })
  public groups: Collection<Group> = new Collection<Group>(this);

  @ApiHideProperty()
  @Exclude()
  @OneToMany({
    entity: () => GroupUser,
    mappedBy: (groupUser: GroupUser) => groupUser.user,
  })
  public groupsPivot: Collection<GroupUser> = new Collection<GroupUser>(this);

  @ApiProperty({
    type: () => Branch,
    nullable: false,
  })
  @ReferenceToEntity()
  @ManyToOne(() => Branch, {
    ref: true,
    inversedBy: (branch: Branch) => branch.users,
    strategy: LoadStrategy.JOINED,
    eager: false,
    cascade: [],
    deleteRule: 'cascade',
    nullable: true,
    index: true,
  })
  public branch: Ref<Branch> | null;

  @ApiProperty({
    type: () => Role,
    nullable: false,
  })
  @ReferenceToEntity()
  @ManyToOne(() => Role, {
    ref: true,
    inversedBy: (role: Role) => role.users,
    strategy: LoadStrategy.JOINED,
    eager: false,
    cascade: [],
  })
  public role: Ref<Role>;

  @Property()
  language: Language = Language.EN;

  @Property()
  origin: UserOrigin = UserOrigin.DEFAULT;

  @Property({ nullable: true })
  freeTrialEndsAt?: Date;

  @ApiProperty({
    type: () => UserMeta,
    nullable: true,
  })
  @Embedded({
    entity: () => UserMeta,
    nullable: true,
    object: true,
  })
  meta?: UserMeta;

  public async getGroups(): Promise<Group[]> {
    if (!this.groups.isInitialized()) {
      await this.groups.init();
    }

    return this.groups.getItems();
  }

  public setAccount(account: Account): void {
    this.account = Reference.create(account);
  }

  public setBranch(branchId: string | null): void {
    if (branchId) {
      this.branch = Reference.createFromPK(Branch, branchId);
    } else {
      this.branch = null;
    }
  }
} 