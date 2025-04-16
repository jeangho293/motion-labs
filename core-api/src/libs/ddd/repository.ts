import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, ObjectType } from 'typeorm';

export abstract class DddRepository<T> {
  abstract entityClass: ObjectType<T>;

  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  get entityManager(): EntityManager {
    return this.datasource.manager;
  }
}
