import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions } from '@nestjs/swagger';
import * as swStats from "swagger-stats";

const env = process.env
@Injectable()
export class DynamicSwaggerConfigService {

    private readonly name = env.NAME?.toUpperCase();
    private readonly version = env.VERSION;
    private readonly servers = [
        `http://${'192.168.0.109'}:${env.PORT}/api/v1`,
        `http://localhost:${env.PORT}/api/v1`,
        `https://localhost:${env.PORT}/api/v1`,
    ];

    createDocumentConfig() {
        return new DocumentBuilder()
            .setTitle(`${this.name} Service API`)
            .setDescription(`The ${this.name} API description`)
            .setVersion(this.version)
            .addServer(this.servers[0])
            .addServer(this.servers[1])
            .addServer(this.servers[2])
            .addCookieAuth('accessToken', {
                type: 'http',
                scheme: 'bearer',
                name: 'JWT',
                description: 'Enter token',
                in: 'cookie',
            }, 'in-app-cookie-name')
            .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT bearer token',
                in: 'header',
            }, 'app-jwt-bearer-auth')
            .addBasicAuth({
                type: 'http',
                scheme: 'basic',
                name: 'Basic',
                description: 'Enter basic auth',
                in: 'header',
            }, 'app-basic-auth')
            .build();
    }

    createCustomOptions(): SwaggerCustomOptions {
        return {
            swaggerOptions: {
                persistAuthorization: true,
            },
        };
    }

    createDocumentOptions(): SwaggerDocumentOptions {
        return {};
    }
    
    createSwaggerStats(app) {
        app.use(swStats.getMiddleware({
            name: 'swagger-stats-auth',
            version: process.env.VERSION,
            hostname: 'localhost',
            ip: '127.0.0.1',
            timelineBucketDuration: 60000,
            swaggerSpec: `http://localhost:${process.env.PORT}/api-json`,
            durationBuckets: [50, 100, 200, 500, 1000, 5000],
            requestSizeBuckets: [500, 5000, 15000, 50000],
            responseSizeBuckets: [600, 6000, 6000, 60000],
            apdexThreshold: 50,
            onResponseFinish: () => {},
            authentication: true,
            onAuthenticate: (req, username, password) => username === 'swagger-stats' && password === 'swagger-stats'
        }));
    }
}