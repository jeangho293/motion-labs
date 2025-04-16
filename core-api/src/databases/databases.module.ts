import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsService } from '@configs';
import { DataSource } from 'typeorm';
import entities from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService) => ({
        ...configsService.mysql,
        entities,
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
