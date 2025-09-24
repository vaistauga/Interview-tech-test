import { ICommand } from '@nestjs/cqrs';
import { UsersImportRequestDto } from '../dto';

export class AnalyzeUsersCommand implements ICommand {
  public constructor(
    public readonly file: Express.Multer.File,
    public readonly dto: UsersImportRequestDto,
  ) {}
}