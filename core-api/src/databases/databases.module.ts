import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsService } from '@configs';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService) => ({
        ...configsService.mysql,
      }),
    }),
  ],
})
export class DatabasesModule implements OnModuleInit {
  constructor(private readonly datasource: DataSource) {}

  onModuleInit() {
    if (!this.datasource.isInitialized) {
      throw new Error('mysql is not connected. please check.');
    }
    console.log('mysql is connected.');
  }
}
