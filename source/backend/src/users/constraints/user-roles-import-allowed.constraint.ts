import { ALLOWED_USERS_IMPORT_ROLES } from '@api/users/constants';
import { SystemRoles } from '@api/users/enums';
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'userRolesImportAllowed', async: false })
@Injectable()
export class UserRolesImportAllowedConstraint
  implements ValidatorConstraintInterface
{
  public validate(value: SystemRoles): boolean {
    if (!value) {
      return true;
    }

    return ALLOWED_USERS_IMPORT_ROLES.includes(value);
  }

  public defaultMessage(): string {
    return `role must be one of ${ALLOWED_USERS_IMPORT_ROLES.join(', ')}`;
  }
}
