import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigsService } from '@configs';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerService } from '@libs/swagger';

(async () => {
  const app = await NestFactory.create(AppModule);

  const configsService = app.get(ConfigsService);
  const swaggerService = app.get(SwaggerService);
  const port = configsService.server.port;

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  swaggerService.start(app);

  await app.listen(port, () => console.log(`server is running on ${port}.`));
})();
