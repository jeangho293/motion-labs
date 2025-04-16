import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@libs/pagination';

export class PatientQueryDto extends PaginationDto {
  @IsString()
  @IsOptional()
  chart?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
