import { ValidatePatientsService } from './validate-patients.service';

describe('ValidateService 테스트', () => {
  let validatePatientsService: ValidatePatientsService;

  beforeEach(() => {
    validatePatientsService = new ValidatePatientsService();
  });

  describe('validate 메서드 테스트', () => {
    const patient = {
      차트번호: 'C_1001',
      이름: '김환자1',
      전화번호: '000-1111-2222',
      주민등록번호: '911010-1',
      주소: '서울특별시 성동구',
      메모: '3.6 방문',
    };

    it('전화번호가 000-1111-2222면 00011112222로 반환한다.', () => {
      expect(validatePatientsService.validate([patient])).toEqual([
        {
          chart: 'C_1001',
          name: '김환자1',
          phone: '00011112222',
          rrn: '911010-1',
          address: '서울특별시 성동구',
          memo: '3.6 방문',
        },
      ]);
    });
  });

  describe('mergeDuplicatedPatient 메서드 테스트', () => {
    const patients = [
      {
        chart: 'C_1001',
        name: '김환자1',
        phone: '00000000000',
        rrn: '010101-1',
        address: '서울특별시 성동구',
        memo: '3.6 방문',
      },
      {
        chart: '',
        name: '김환자1',
        phone: '00000000000',
        rrn: '010101-1',
        address: '',
        memo: '3.7 방문',
      },
      {
        chart: 'C_1002',
        name: '김환자1',
        phone: '00000000000',
        rrn: '010101-1',
        address: '서울특별시 성동구',
        memo: '노쇼',
      },
      {
        chart: '',
        name: '김환자1',
        phone: '00000000000',
        rrn: '010101-2',
        address: '',
        memo: '3.7 방문',
      },
      {
        chart: 'C_1002',
        name: '김환자1',
        phone: '00000000000',
        rrn: '010101-1',
        address: '서울특별시 강동구',
        memo: '',
      },
      {
        chart: '',
        name: '김환자2',
        phone: '00000000000',
        rrn: '010101-1',
        address: '',
        memo: '',
      },
    ];

    it('중복된 Patient에 대해서 병합작업을 한다.', () => {
      expect(validatePatientsService.mergeDuplicatedPatient(patients)).toEqual([
        {
          chart: 'C_1001',
          name: '김환자1',
          phone: '00000000000',
          rrn: '010101-1',
          address: '서울특별시 성동구',
          memo: '3.7 방문',
        },
        {
          chart: 'C_1002',
          name: '김환자1',
          phone: '00000000000',
          rrn: '010101-1',
          address: '서울특별시 강동구',
          memo: '3.7 방문',
        },
        {
          chart: '',
          name: '김환자2',
          phone: '00000000000',
          rrn: '010101-1',
          address: '',
          memo: '',
        },
      ]);
    });
  });

  describe('normalizeIdentificationNumber 메서드 테스트', () => {
    it('900101은 900101-0으로 반환된다.', () => {
      expect(validatePatientsService.normalizeIdentificationNumber('900101')).toBe('900101-0');
    });

    it('9001011은 900101-1으로 반환된다.', () => {
      expect(validatePatientsService.normalizeIdentificationNumber('9001011')).toBe('900101-1');
    });

    it('900101-1은 900101-1으로 반환된다.', () => {
      expect(validatePatientsService.normalizeIdentificationNumber('900101-1')).toBe('900101-1');
    });

    it('900101-1*****은 900101-1으로 반환된다.', () => {
      expect(validatePatientsService.normalizeIdentificationNumber('900101-1*****')).toBe(
        '900101-1'
      );
    });

    it('900101-1234567은 900101-1으로 반환된다.', () => {
      expect(validatePatientsService.normalizeIdentificationNumber('900101-1234567')).toBe(
        '900101-1'
      );
    });

    it('900은 빈 문자열을 반환된다.', () => {
      expect(validatePatientsService.normalizeIdentificationNumber('900')).toBe('');
    });

    it('숫자 이외의 문자열이 포함되어있다면 빈 문자열을 반환된다.', () => {
      expect(validatePatientsService.normalizeIdentificationNumber('900bcd-1')).toBe('');
    });
  });

  describe('stripEmpty 메서드 테스트', () => {
    it('해당 객체의 값이 빈 문자열이면 해당 키를 제거한다.', () => {
      const patient = {
        chart: '',
        name: '김환자1',
        phone: '00011112222',
        rrn: '',
        address: '서울시 성동구',
        memo: '',
      };

      expect(validatePatientsService.stripEmpty(patient)).toEqual({
        name: '김환자1',
        phone: '00011112222',
        address: '서울시 성동구',
      });
    });
  });
});
