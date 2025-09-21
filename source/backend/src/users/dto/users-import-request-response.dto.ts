import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UsersImportRequestResponseDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    public fileId: string;

    @ApiProperty()
    @IsNumber()
    public totalRecordsInFile: number;

    @ApiProperty()
    @IsNumber()
    public totalNewRecords: number;
}
