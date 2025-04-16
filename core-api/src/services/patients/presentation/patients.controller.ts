import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PatientsService } from '../application/patients.service';
import { PatientQueryDto } from './dto';
import { ApiFindPatients, ApiUploadPatients } from './swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @ApiFindPatients()
  async get(@Query() query: PatientQueryDto) {
    const { chart, name, phone, limit, page } = query;

    const { total, patients } = await this.patientsService.list(
      { chart, name, phone },
      { limit, page }
    );

    return { total, page, count: limit, data: patients };
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiUploadPatients()
  async upload(@UploadedFile() file: Express.Multer.File) {
    const { buffer } = file;

    const data = await this.patientsService.upload(buffer);
    return { data };
  }
}
