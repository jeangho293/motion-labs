import { Injectable } from '@nestjs/common';
import { DddRepository } from '@libs/ddd';
import { Patient } from './patients.entity';
import { convertOptions, FindManyOptions } from '@libs/pagination';

@Injectable()
export class PatientsRepository extends DddRepository<Patient> {
  entityClass = Patient;

  async find(
    conditions: { chart?: string; name?: string; phone?: string },
    options?: FindManyOptions
  ) {
    return this.entityManager.find(this.entityClass, {
      where: {
        chart: conditions.chart,
        name: conditions.name,
        phone: conditions.phone,
      },
      ...convertOptions(options),
    });
  }

  async count(conditions: { chart?: string; name?: string; phone?: string }) {
    return this.entityManager.count(this.entityClass, {
      where: {
        chart: conditions.chart,
        name: conditions.name,
        phone: conditions.phone,
      },
    });
  }
}
