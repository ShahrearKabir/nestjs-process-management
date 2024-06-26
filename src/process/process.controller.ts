import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProcessService } from './process.service';
import { Process } from './schemas/process.schema';
import { ApiAcceptedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProcessDto } from './dto/create-process.dto';

const BASE = 'processes'; // base url
@Controller(BASE)
@ApiTags('Processes Controller')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @ApiAcceptedResponse({
    type: CreateProcessDto
  })
  @ApiOperation({
    operationId: `${BASE}Create`,
    summary: `Create a single ${BASE}`,
    description: ``
  })
  @Post('/create-process')
  async create() {
    return this.processService.createWithAgenda();
  }

  @ApiOkResponse({
    type: CreateProcessDto,
    isArray: true
  })
  @ApiOperation({
    operationId: `${BASE}GetAll`,
    summary: `Get All ${BASE}`,
    description: ``
  })
  @Get('/get-all')
  async findAll() {
    return this.processService.findAll();
  }

  @ApiOkResponse({
    type: CreateProcessDto
  })
  @ApiOperation({
    operationId: `${BASE}GetSingle`,
    summary: `Get Single ${BASE}`,
    description: ``
  })
  @Get('/get-single/:pid')
  async findOne(@Param('pid') pid: number) {
    return this.processService.findOne(pid);
  }

  @ApiOkResponse({
    type: CreateProcessDto
  })
  @ApiOperation({
    operationId: `${BASE}DeleteSingle`,
    summary: `Delete Single ${BASE}`,
    description: ``
  })
  @Delete('/delete-process/:pid')
  async delete(@Param('pid') pid: number) {
    return this.processService.deleteWithAgenda(pid);
  }
}