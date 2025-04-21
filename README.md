모션랩스 사전과제

실행 방법

1. 데이터베이스 실행

   ```shell
   docker compose up --build
   ```

   명령어로 MySQL을 실행 후 motion 데이터베이스 생성.

2. .env.development.local 파일 생성

   `.env.example` 에 기재된 환경 변수를 그대로 적용해주시면 됩니다.

3. 애플리케이션 실행

   core-api 경로에서 `npm run start:dev` 실행하시면 됩니다.

데이터 전처리 과정에서 중복 데이터 병합에 대한 workflow
![alt text](<스크린샷 2025-04-17 오후 12.29.58.png>)
