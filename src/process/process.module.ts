import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { Process, ProcessSchema } from './schemas/process.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { Log, LogSchema } from 'src/process/schemas/log.schema';
import { AgendaService } from 'src/agenda/agenda.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Process.name, schema: ProcessSchema },
      { name: Log.name, schema: LogSchema },
    ]),
    ScheduleModule.forRoot()
  ],
  providers: [ProcessService, AgendaService],
  controllers: [ProcessController],
})
export class ProcessModule {}