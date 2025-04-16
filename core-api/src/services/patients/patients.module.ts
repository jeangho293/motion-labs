import { Module } from '@nestjs/common';
import { PatientsController } from './presentation/patients.controller';
import { PatientsService } from './application/patients.service';
import { PatientsRepository } from './infrastructure/patients.repository';
import { FileModule } from '@libs/file';
import { ValidatePatientsService } from './application/validate-patients.service';

@Module({
  imports: [FileModule],
  controllers: [PatientsController],
  providers: [PatientsService, ValidatePatientsService, PatientsRepository],
  exports: [PatientsService, PatientsRepository],
})
export class PatientsModule {}
