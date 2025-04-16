import { Injectable } from '@nestjs/common';
import { PatientsRepository } from '../infrastructure/patients.repository';
import { FileService } from '@libs/file';
import { ValidatePatientsService } from './validate-patients.service';
import { PatientExcelColumn } from '../domain/patients.entity';

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
  ) {
    const [patients, total] = await Promise.all([
      this.patientsRepository.find({ chart, name, phone }, { page, limit }),
      this.patientsRepository.count({ chart, name, phone }),
    ]);

    return { patients, total };
  }

  /**
   * @description 파일 업로드를 통한 환자 등록 및 수정 API
   */
  async upload(buffer: Buffer) {
    const parsedPatients = this.fileService.parse<PatientExcelColumn>(buffer);

    const formattedPatients = this.validatePatientsService.validate(parsedPatients);

    return { totalRows: 1, processedRows: 1, skippedRows: 1 };
  }
}
