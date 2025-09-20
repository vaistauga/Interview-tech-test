import { Group } from '@api/group/entities/group.entity';
import { ReferenceToEntity } from '@api/shared/decorators/reference-to-entity.decorator';
import { User } from '@api/users/entities/user.entity';
import {
  Entity,
  LoadStrategy,
  ManyToOne,
  Property,
  Ref,
  Reference,
} from '@mikro-orm/core';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class GroupUser {
  @ApiHideProperty()
  @Exclude()
  @ReferenceToEntity()
  @ManyToOne({
    entity: () => Group,
    primary: true,
    ref: true,
    index: true,
    strategy: LoadStrategy.JOINED,
    cascade: [],
    deleteRule: 'cascade',
    updateRule: 'cascade',
    inversedBy: (group: Group) => group.usersPivot,
  })
  public group!: Ref<Group>;

  @ApiHideProperty()
  @Exclude()
  @ReferenceToEntity()
  @ManyToOne({
    entity: () => User,
    primary: true,
    ref: true,
    index: true,
    strategy: LoadStrategy.JOINED,
    cascade: [],
    deleteRule: 'cascade',
    updateRule: 'cascade',
    inversedBy: (user: User) => user.groupsPivot,
  })
  public user!: Ref<User>;

  @ApiProperty({
    readOnly: true,
    nullable: false,
  })
  @Property({
    defaultRaw: 'CURRENT_TIMESTAMP',
    onCreate: () => new Date(),
    index: true,
  })
  public joinedAt!: Date;

  public setUser(user: User): void {
    this.user = Reference.create(user);
  }

  public async getUser(): Promise<User> | null {
    if (!this.user) {
      return null;
    }

    if (!this.user.isInitialized()) {
      await this.user.load();
    }

    return this.user.getEntity();
  }

  public setGroup(group: Group): void {
    this.group = Reference.create(group);
  }

  public async getGroup(): Promise<Group> {
    if (!this.group.isInitialized()) {
      await this.group.load();
    }

    return this.group.getEntity();
  }
}
