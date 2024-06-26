import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessModule } from './process/process.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicSwaggerModule } from './swagger/dynamic-swagger.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    DynamicSwaggerModule.forRoot(),
    ProcessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
