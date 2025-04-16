import { Module } from '@nestjs/common';
import { ConfigsModule } from '@configs';
import { DatabasesModule } from './databases';
import { PatientsModule } from './services/patients/patients.module';
import { SwaggerModule } from '@libs/swagger';

@Module({
  imports: [ConfigsModule, DatabasesModule, SwaggerModule, PatientsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
