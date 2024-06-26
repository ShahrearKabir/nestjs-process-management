import { Agenda } from '@hokify/agenda';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from 'src/process/schemas/log.schema';
import { Process, ProcessDocument } from 'src/process/schemas/process.schema';

@Injectable()
export class AgendaService implements OnModuleInit, OnModuleDestroy {
    private agenda: Agenda;

    constructor(
        @InjectModel(Process.name) private processModel: Model<ProcessDocument>,
        @InjectModel(Log.name) private logModel: Model<Log>,
    ) {
        this.agenda = new Agenda({ db: { address: process.env.MONGO_DB_URL } });    // 'mongodb://localhost/agenda'
    }

    async onModuleInit() {
        await this.agenda.start();
        await this.loadExistingJobs();
    }

    async onModuleDestroy() {
        await this.agenda.stop();
    }

    private async loadExistingJobs() {
        const processes = await this.processModel.find();
        processes.map(async process => await this.scheduleProcess(process));
    }

    async scheduleProcess(process: Process) {
        await this.agenda.define(process?.pid.toString(), async job => {
            // Define the job logic here
            console.log(`Executing process: ${process?.pid}`);
            await this.addCronJob(process?.pid)
        });

        await this.agenda.every(process.cronExpression, process?.pid.toString());
    }

    private async addCronJob(pid: number, seconds?: string) {
        const createdLog = new this.logModel({ processId: pid });
        await createdLog.save();
    }

    async cancelAgenda(pid: number): Promise<Process> {
        const deletedProcess = await this.processModel.findOneAndDelete({ pid }).exec();
        await this.agenda.cancel({ name: deletedProcess.pid.toString() });
        return deletedProcess;
    }

}