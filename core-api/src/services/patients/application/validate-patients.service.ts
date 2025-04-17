import { Injectable } from '@nestjs/common';
import { PatientExcelColumn } from '../domain/patients.entity';

type RawPatient = {
  chart: string;
  name: string;
  phone: string;
  rrn: string;
  address: string;
  memo: string;
};

@Injectable()
export class ValidatePatientsService {
  validate(patients: PatientExcelColumn[]) {
    const result = patients
      .filter((patient) => {
        /**
         * @description 이름: 1자 이상 255자 이하의 문자열
         */
        const name = patient['이름'];
        if (name.length === 0 || name.length > 255) {
          return false;
        }

        /**
       * @description 전화번호:
       *              - 11자: Hyphen(-)이 제외된 대한민국 휴대폰 번호 (01000000000)
                      - 13자: Hyphen(-)이 포함된 대한민국 휴대폰 번호 (010-0000-0000)
       */
        const phone = patient['전화번호'].replace(/-/g, '');
        if (phone.length !== 11 || !/^[0-9]*$/.test(phone)) {
          return false;
        }

        /**
       * @description 주민등록번호
       *              - 6자: 생년월일 (ex: 900101)
                      - 7자: 생년월일 및 성별 식별값 (ex: 9001011)
                      - 8자: 생년월일 및 성별 식별값 (ex: 900101-1)
                      - 9자 이상: 생년월일 및 성별 식별값 ( ex: 900101-1111111)
                          - 성별 식별값 이후의 값이 `*`로 마스킹 된 경우에도 올바른 데이터로 간주합니다. (ex: 900101-1*****)
       */
        const rrn = this.normalizeIdentificationNumber(patient['주민등록번호']);
        if (!rrn) {
          return false;
        }

        /**
         * @description 255자 이하의 문자열
         */
        const chart = patient['차트번호'];
        if (chart.length > 255) {
          return false;
        }

        /**
         * @description 255자 이하의 문자열
         */
        const address = patient['주소'];
        if (address.length > 255) {
          return false;
        }

        /**
         * @description 255자 이하의 문자열
         */
        const memo = patient['메모'];
        if (memo.length > 255) {
          return false;
        }

        return true;
      })
      .map((patient) => ({
        chart: patient['차트번호'],
        name: patient['이름'],
        phone: patient['전화번호'].replace(/-/g, ''),
        rrn: this.normalizeIdentificationNumber(patient['주민등록번호']),
        address: patient['주소'],
        memo: patient['메모'],
      }));
    return result;
  }

  mergeDuplicatedPatient(patients: RawPatient[]) {
    const result: RawPatient[] = [];
    const patientsWithChart = new Map<string, Map<string, RawPatient>>();
    const patientWithNoChart = new Map<string, RawPatient>();

    patients.forEach((patient) => {
      const uniqueKey = patient.name + patient.phone;
      const hasChart = !!patient.chart;

      if (hasChart) {
        const a = patientsWithChart.get(uniqueKey);

        if (a) {
          const b = a.get(patient.chart);
          if (b) {
            a.set(patient.chart, Object.assign(b, this.stripEmpty(patient)));
          } else {
            a.set(patient.chart, patient);
          }
        } else {
          patientsWithChart.set(uniqueKey, new Map().set(patient.chart, patient));
        }
      } else {
        const a = patientWithNoChart.get(uniqueKey);
        if (a) {
          patientWithNoChart.set(uniqueKey, Object.assign(a, this.stripEmpty(patient)));
        } else {
          const b = patientsWithChart.get(uniqueKey);

          if (b) {
            const lastEntry = Array.from(b.entries()).at(-1);
            if (lastEntry) {
              const [key, value] = lastEntry;
              b.set(key, Object.assign(value, this.stripEmpty(patient)));
            }
          } else {
            patientWithNoChart.set(uniqueKey, patient);
          }
        }
      }
    });

    patientsWithChart.forEach((innerMap) => {
      innerMap.forEach((patient) => {
        result.push({ ...patient });
      });
    });

    result.push(...Array.from(patientWithNoChart.values()));

    return result;
  }

  normalizeIdentificationNumber(input: string) {
    // 하이픈 제거
    const noDash = input.replace(/-/g, '');

    if (/^\d{6}$/.test(noDash)) {
      // 생년월일만 입력된 경우 → 성별 식별자 모름 → -0
      return `${noDash}-0`;
    }

    if (/^\d{7}$/.test(noDash)) {
      // 생년월일 + 성별 식별자
      return `${noDash.slice(0, 6)}-${noDash[6]}`;
    }

    if (/^\d{6}-\d{1}(\d{6}|\*{5,6})?$/.test(input)) {
      // 마스킹 포함된 경우 → 앞 8자리만
      return `${input.slice(0, 8)}`;
    }

    return '';
  }

  stripEmpty(patient: RawPatient) {
    const formattedPatient = Object.keys(patient).reduce((acc, key) => {
      if (patient[key] !== '') {
        acc[key] = patient[key];
      }
      return acc;
    }, {} as RawPatient);

    return formattedPatient;
  }
}
