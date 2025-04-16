import { Module } from '@nestjs/common';
import { ConfigsModule } from '@configs';
import { DatabasesModule } from './databases';
import { PatientsModule } from './services/patients/patients.module';

@Module({
  imports: [ConfigsModule, DatabasesModule, PatientsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
