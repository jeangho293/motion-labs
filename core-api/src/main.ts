import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigsService } from '@configs';
import { ValidationPipe } from '@nestjs/common';

(async () => {
  const app = await NestFactory.create(AppModule);

  const configsService = app.get(ConfigsService);
  const port = configsService.server.port;

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port, () => console.log(`server is running on ${port}.`));
})();
