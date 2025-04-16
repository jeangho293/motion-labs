import { INestApplication, Injectable } from '@nestjs/common';
import {
  type OpenAPIObject,
  SwaggerModule as NestSwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

@Injectable()
export class SwaggerService {
  private config: Omit<OpenAPIObject, 'paths'>;

  constructor() {
    this.config = new DocumentBuilder()
      .setTitle('core-api')
      .setDescription('모션랩스 사전과제 API')
      .setVersion('1.0')
      .build();
  }

  start(application: INestApplication) {
    const documentFactory = () => NestSwaggerModule.createDocument(application, this.config);
    NestSwaggerModule.setup('api', application, documentFactory);
  }
}
