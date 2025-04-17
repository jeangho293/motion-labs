import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class FileService {
  parse<T>(file: Buffer) {
    const workbook = XLSX.read(file, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // NOTE: 파일의 내부 컬럼들의 타입은 모두 string으로 명시한다.
    return XLSX.utils.sheet_to_json<T>(worksheet, { defval: '', raw: false });
  }
}
