import { Controller, Get, Post } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('/patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async list() {
    const data = await this.patientsService.list();
    return data;
  }

  @Post('/upload')
  async upload() {}
}
