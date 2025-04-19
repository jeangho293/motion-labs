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

    const temp = [
      {
        chart: 'C_1001',
        name: '김환자1',
        phone: '01000000000',
        rrn: '010101-1',
        address: '서울특별시 성동구',
        memo: '3.7 방문',
      },
      {
        chart: 'C_1002',
        name: '김환자1',
        phone: '01000000000',
        rrn: '010101-1',
        address: '서울특별시 강동구',
        memo: '3.7 방문',
      },
      {
        chart: '',
        name: '김환자2',
        phone: '01000000000',
        rrn: '010101-1',
        address: '',
        memo: '',
      },
    ];
    await this.patientsRepository.save(temp.map((patient) => new Patient(patient)));
    // await this.patientsRepository.save(temp);

    return {
      totalRows: parsedPatients.length,
      processedRows: mergedPatients.length,
      skippedRows: parsedPatients.length - mergedPatients.length,
    };
  }
}
