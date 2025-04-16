import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigsService {
  constructor(private readonly configService: ConfigService) {}

  get<T>(key: string) {
    return this.configService.get<T>(key);
  }

  get server() {
    const config = {
      port: this.configService.get<string>('SERVER_PORT') ?? 3000,
    };

    this.checkUndefinedValue(config, 'server');
    return config;
  }

  private checkUndefinedValue(config: string | object, type: string) {
    Object.entries(config).forEach(([key, value]) => {
      // NOTE: value가 의도적으로 0일 수 있으니 undefined를 직접 명시해준다.
      if (value === undefined) {
        throw new Error(`There is no ${type}'s ${key} env value. check please.`);
      }
    });
  }
}
