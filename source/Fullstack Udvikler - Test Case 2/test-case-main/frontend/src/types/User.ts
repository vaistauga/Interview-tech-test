import { Branch } from './Branch';
import { Group } from './Group';
import { Role } from './Role';
import { UserMeta } from './UserMeta';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isActive: boolean;
  meta?: UserMeta;
  groups?: Group[];
  branch?: Branch;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};
