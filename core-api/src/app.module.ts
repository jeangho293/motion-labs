import { Module } from '@nestjs/common';
import { ConfigsModule } from '@configs';

@Module({
  imports: [ConfigsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
