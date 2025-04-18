import { Injectable } from '@nestjs/common';
import { DddRepository } from '@libs/ddd';
import { Patient } from '../domain/patients.entity';
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

  async save(patients: Patient[]) {
    await this.entityManager.transaction(async (transactionEntityManager) => {
      const queryRunner = transactionEntityManager.queryRunner!;

      await queryRunner.query(`
        CREATE TEMPORARY TABLE temp_patient_import (
          chart VARCHAR(255),
          name VARCHAR(255),
          phone VARCHAR(255),
          rrn VARCHAR(255),
          address VARCHAR(255),
          memo VARCHAR(255)
        )
      `);

      await transactionEntityManager
        .createQueryBuilder()
        .insert()
        .into('temp_patient_import')
        .values(patients)
        .execute();

      //       // step 3: chart 있는 데이터가 chart 없는 기존 레코드를 업데이트 (빈 값은 덮어쓰지 않음)
      //       await queryRunner.query(`
      //   UPDATE patient p
      //   JOIN temp_patient_import t
      //     ON p.chart = '' AND t.chart != ''
      //     AND p.name = t.name AND p.phone = t.phone
      //   SET
      //     p.chart = t.chart,
      //     p.name = COALESCE(NULLIF(t.name, ''), p.name),
      //     p.address = COALESCE(NULLIF(t.address, ''), p.address),
      //     p.memo = COALESCE(NULLIF(t.memo, ''), p.memo)
      // `);

      //       // step 4: chart 없는 데이터가 chart 있는 기존 레코드를 업데이트 (chart는 덮어쓰지 않음)
      //       await queryRunner.query(`
      // -- step 4: chart 없는 데이터를 chart 있는 기존 레코드에 병합 (값이 있는 것만 덮어쓰기)
      // UPDATE patient p
      // JOIN temp_patient_import t
      //   ON p.chart != '' AND t.chart = ''
      //   AND p.name = t.name AND p.phone = t.phone
      // SET
      //   p.name = t.name,
      //   p.address = IFNULL(NULLIF(t.address, ''), p.address),
      //   p.memo = IFNULL(NULLIF(t.memo, ''), p.memo)

      // `);

      //       // step 5: chart 없는 데이터 중 기존에 없던 환자 insert
      //       await queryRunner.query(`
      // INSERT INTO patient (chart, name, phone, rrn, address, memo)
      // SELECT t.chart, t.name, t.phone, t.rrn, t.address, t.memo
      // FROM temp_patient_import t
      // LEFT JOIN patient p
      //   ON t.name = p.name AND t.phone = p.phone
      // WHERE p.id IS NULL

      // `);

      await queryRunner.query(`DROP TEMPORARY TABLE IF EXISTS temp_patient_import`);
    });
  }
}
