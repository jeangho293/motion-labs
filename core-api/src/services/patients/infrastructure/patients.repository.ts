import { Injectable } from '@nestjs/common';
import { DddRepository } from '@libs/ddd';
import { Patient } from '../domain/patients.entity';
import { convertOptions, FindManyOptions } from '@libs/pagination';
import { ResultSetHeader } from 'mysql2';

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

  async upload(patients: Patient[]) {
    return this.entityManager.transaction(async (transactionEntityManager) => {
      const queryRunner = transactionEntityManager.queryRunner!;

      // NOTE: 임시 테이블 전략으로 데이터베이서 과부하를 줄이자. (절대 순서를 바꾸지 말것.)
      // step 1. 임시 테이블 생성
      await queryRunner.query(`
        CREATE TEMPORARY TABLE temp_patient (
          chart VARCHAR(255),
          name VARCHAR(255),
          phone VARCHAR(255),
          rrn VARCHAR(255),
          address VARCHAR(255),
          memo VARCHAR(255)
        )
      `);

      // step 2. patients 모두 임시 테이블에 삽입
      await transactionEntityManager
        .createQueryBuilder()
        .insert()
        .into('temp_patient')
        .values(patients)
        .execute();

      // step 3: chart, name, phone이 모두 동일한 레코드에 대하여 업데이트
      const { affectedRows: stepResult1 } = (await queryRunner.query(`
        UPDATE patient p
          JOIN temp_patient t
            ON p.chart = t.chart AND p.name = t.name AND p.phone = t.phone
        SET
          p.rrn = COALESCE(NULLIF(t.rrn, ''), p.rrn),
          p.address = COALESCE(NULLIF(t.address, ''), p.address),
          p.memo = COALESCE(NULLIF(t.memo, ''), p.memo)
      `)) as ResultSetHeader;

      // step 4: chart 가 있는 데이터 -> chart가 없는 기존 레코드를 업데이트한다. (chart도 업데이트.)
      const { affectedRows: stepResult2 } = (await queryRunner.query(`
        UPDATE patient p
        JOIN temp_patient t
        ON p.chart = '' AND t.chart != '' AND p.name = t.name AND p.phone = t.phone
      SET
        p.chart = t.chart,
        p.rrn = COALESCE(NULLIF(t.rrn, ''), p.rrn),
        p.address = COALESCE(NULLIF(t.address, ''), p.address),
        p.memo = COALESCE(NULLIF(t.memo, ''), p.memo)
      `)) as ResultSetHeader;

      // step 5: chart 가 없는 데이터 -> chart가 있는 기존 레코드를 업데이트한다. (chart는 예외.)
      const { affectedRows: stepResult3 } = (await queryRunner.query(`
        UPDATE patient p
        JOIN temp_patient t
        ON p.chart = '' AND t.chart != '' AND p.name = t.name AND p.phone = t.phone
      SET
        p.rrn = COALESCE(NULLIF(t.rrn, ''), p.rrn),
        p.address = COALESCE(NULLIF(t.address, ''), p.address),
        p.memo = COALESCE(NULLIF(t.memo, ''), p.memo)
      `)) as ResultSetHeader;

      // step 5: chart 없는 데이터 중 기존에 없던 환자 insert
      const { affectedRows: stepResult4 } = (await queryRunner.query(`
      INSERT INTO patient (chart, name, phone, rrn, address, memo)
        SELECT t.chart, t.name, t.phone, t.rrn, t.address, t.memo
        FROM temp_patient t
          LEFT JOIN patient p
          ON t.chart = p.chart AND t.name = p.name AND t.phone = p.phone
        WHERE p.id IS NULL AND t.chart != ''
      `)) as ResultSetHeader;

      // step 6. name + phone이 새로운 레코드면 insert 한다.
      const { affectedRows: stepResult5 } = (await queryRunner.query(`
        INSERT INTO patient (chart, name, phone, rrn, address, memo)
          SELECT t.chart, t.name, t.phone, t.rrn, t.address, t.memo
          FROM temp_patient t
            LEFT JOIN patient p
            ON t.name = p.name AND t.phone = p.phone
          WHERE p.id IS NULL
          `)) as ResultSetHeader;

      await queryRunner.query(`DROP TEMPORARY TABLE IF EXISTS temp_patient`);

      return { processedRows: stepResult1 + stepResult2 + stepResult3 + stepResult4 + stepResult5 };
    });
  }
}
