import { Controller, Get, Post } from '@nestjs/common';

@Controller('/patients')
export class PatientsController {
  @Get()
  async list() {}

  @Post('/upload')
  async upload() {}
}
