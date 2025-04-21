import { Injectable } from '@nestjs/common';
import { PatientsRepository } from '../infrastructure/patients.repository';
import { FileService } from '@libs/file';
import { ValidatePatientsService } from './validate-patients.service';
import { Patient, PatientExcelColumn } from '../domain/patients.entity';
import { Paginated } from '@libs/pagination';

@Injectable()
export class PatientsService {
  constructor(
    private readonly patientsRepository: PatientsRepository,
    private readonly fileService: FileService,
    private readonly validatePatientsService: ValidatePatientsService
  ) {}

  /**
   *
   * @description 환자 목록 조회 API
   */
  async list(
    { chart, name, phone }: { chart?: string; name?: string; phone?: string },
    { page, limit }: { page?: number; limit?: number }
  ): Promise<Paginated<Patient[]>> {
    const [patients, total] = await Promise.all([
      this.patientsRepository.find({ chart, name, phone }, { page, limit }),
      this.patientsRepository.count({ chart, name, phone }),
    ]);

    return { data: patients, total };
  }

  /**
   * @description 파일 업로드를 통한 환자 등록 및 수정 API
   */
  async upload(buffer: Buffer) {
    const parsedPatients = this.fileService.parse<PatientExcelColumn>(buffer);
    const formattedPatients = this.validatePatientsService.validate(parsedPatients);
    const mergedPatients = this.validatePatientsService.mergeDuplicatedPatient(formattedPatients);

    const { processedRows } = await this.patientsRepository.upload(
      mergedPatients.map((patient) => new Patient(patient))
    );

    return {
      totalRows: parsedPatients.length,
      processedRows,
      skippedRows: parsedPatients.length - processedRows,
    };
  }
}
