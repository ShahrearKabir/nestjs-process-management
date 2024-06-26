import { Module, DynamicModule } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { DynamicSwaggerConfigService } from './dynamic-swagger-config.service';

@Module({
  providers: [DynamicSwaggerConfigService],
})
export class DynamicSwaggerModule {
  static forRoot(): DynamicModule {
    return {
      module: DynamicSwaggerModule,
      providers: [DynamicSwaggerConfigService],
      exports: [DynamicSwaggerConfigService],
    };
  }

  static setup(app: any, configService: DynamicSwaggerConfigService) {
    const documentConfig = configService.createDocumentConfig();
    const customOptions = configService.createCustomOptions();
    const documentOptions = configService.createDocumentOptions();
    const document = SwaggerModule.createDocument(app, documentConfig, documentOptions);
    SwaggerModule.setup('api', app, document, customOptions);

    configService.createSwaggerStats(app);
  }
}
