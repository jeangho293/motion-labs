import { Injectable } from '@nestjs/common';
import { PatientsRepository } from './patients.repository';

@Injectable()
export class PatientsService {
  constructor(private readonly patientsRepository: PatientsRepository) {}

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
}
