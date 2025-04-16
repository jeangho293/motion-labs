import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileUploadDto } from './dto';

export function ApiFindPatients() {
  return applyDecorators(
    ApiOperation({ summary: '환자 목록 조회' }),
    ApiResponse({
      status: 200,
      description: '응답 예시',
      example: {
        total: 50000,
        page: 1,
        count: 1,
        data: [
          {
            id: 1,
            chart: 'C_1001',
            name: '김환자1',
            phone: '00012345678',
            rrn: '911111-1',
            address: '서울특별시 성동구',
            memo: '3.7 방문함',
          },
        ],
      },
    })
  );
}

export function ApiUploadPatients() {
  return applyDecorators(
    ApiOperation({ summary: 'excel에 의한 환자 업로드' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '환자 excel 파일',
      type: FileUploadDto,
    }),
    ApiResponse({
      status: 201,
      description: '응답 예시',
      example: {
        totalRows: 50000,
        processedRows: 49800,
        skippedRows: 200,
      },
    })
  );
}
