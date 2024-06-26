import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Process } from './schemas/process.schema';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CreateProcessDto } from './dto/create-process.dto';
import { Log } from 'src/process/schemas/log.schema';

@Injectable()
export class ProcessService {
  private readonly logger = new Logger(ProcessService.name);
  constructor(
    @InjectModel(Process.name) private processModel: Model<Process>,
    @InjectModel(Log.name) private logModel: Model<Log>,
    private schedulerRegistry: SchedulerRegistry
  ) { }

  async create(): Promise<any> {
    const createdProcess = new this.processModel();
    await createdProcess.save();

    this.addCronJob(createdProcess.pid, '*/5');
    return createdProcess;
  }

  async findAll(): Promise<Process[]> {
    return this.processModel.find().exec();
  }

  async findOne(pid: number): Promise<any> {
    const process = await this.processModel
      .findOne({ pid })
      .select('pid createdAt')
      .lean();

    if (!process) return { error: 'process not found!' }

    process['logs'] = (await this.logModel
      .find({ processId: process?.pid })
      .select('createdAt')
      .lean())
      .map(log => log.createdAt)

    return process
  }

  // async update(id: string, process: Process): Promise<Process> {
  //   return this.processModel.findByIdAndUpdate(id, process, { new: true }).exec();
  // }

  async delete(pid: number): Promise<Process> {
    const deletedProcess = this.processModel.findOneAndDelete({ pid }).exec();

    this.schedulerRegistry.deleteCronJob(pid.toString());

    return deletedProcess
  }

  private addCronJob(pid: number, seconds: string) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`time (${seconds}) for job ${pid} to run!`);

      const createdLog = new this.logModel({ processId: pid });
      createdLog.save();

    });

    this.schedulerRegistry.addCronJob(pid.toString(), job);
    job.start();

    this.logger.warn(
      `job ${pid} added for each minute at ${seconds} seconds!`,
    );
  }

}