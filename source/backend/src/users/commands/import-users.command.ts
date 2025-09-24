import { UsersImportRequestDto } from '@api/users/dto';
import { ICommand } from '@nestjs/cqrs';

export class ImportUsersCommand implements ICommand {
  public constructor(
    public readonly fileId: string,
    public readonly dto: UsersImportRequestDto,
  ) {}
}
