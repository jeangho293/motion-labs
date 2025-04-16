import { Module } from '@nestjs/common';
import { ConfigsModule } from '@configs';
import { DatabasesModule } from './databases';

@Module({
  imports: [ConfigsModule, DatabasesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
