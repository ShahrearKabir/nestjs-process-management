import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { Process, ProcessSchema } from './schemas/process.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { Log, LogSchema } from 'src/process/schemas/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Process.name, schema: ProcessSchema },
      { name: Log.name, schema: LogSchema },
    ]),
    ScheduleModule.forRoot()
  ],
  providers: [ProcessService],
  controllers: [ProcessController],
})
export class ProcessModule {}