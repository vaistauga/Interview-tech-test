import { UsersImportRequestDto } from '@api/users/dto';
import { ICommand } from '@nestjs/cqrs';

export class ImportUsersCommand implements ICommand {
  public constructor(
    public readonly file: Express.Multer.File,
    public readonly dto: UsersImportRequestDto,
  ) {}
}
