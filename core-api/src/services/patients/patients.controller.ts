import { Controller, Get, Post, Query } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientQueryDto } from './dto';

@Controller('/patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async get(@Query() query: PatientQueryDto) {
    const { chart, name, phone, limit, page } = query;

    const { total, patients } = await this.patientsService.list(
      { chart, name, phone },
      { limit, page }
    );

    return { total, page, count: limit, data: patients };
  }

  @Post('/upload')
  async upload() {}
}
