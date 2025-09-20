import { User } from '@api/users/entities/user.entity';
import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Account {
  @PrimaryKey({
    type: 'uuid',
    fieldName: 'id',
  })
  public id: string = v4();

  @Property()
  name!: string;

  @OneToMany(() => User, (user) => user.account)
  users!: User[];
}