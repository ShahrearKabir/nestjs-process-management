import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DynamicSwaggerConfigService } from './swagger/dynamic-swagger-config.service';
import { DynamicSwaggerModule } from './swagger/dynamic-swagger.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'verbose'],
    cors: { origin: '*', credentials: true },
    snapshot: true,
  });

  const configService = app.get(DynamicSwaggerConfigService);
  DynamicSwaggerModule.setup(app, configService);

  app
    .setGlobalPrefix('/api')
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

  await app.listen(process.env.PORT);
}
bootstrap();
