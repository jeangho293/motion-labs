import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiFindPatients() {
  return applyDecorators(
    ApiOperation({ summary: '환자 목록 조회' }),
    ApiResponse({
      status: 200,
      description: '응답 예시',
      example: {
        total: 50000,
        page: 1,
        count: 20,
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
