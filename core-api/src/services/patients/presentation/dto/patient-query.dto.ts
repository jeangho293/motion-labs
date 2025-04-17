import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@libs/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PatientQueryDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '환자 차트번호' })
  chart?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '환자 이름' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '환자 전화번호' })
  phone?: string;
}
