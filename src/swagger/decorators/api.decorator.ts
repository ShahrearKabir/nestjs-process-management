import { HttpCode, RequestMethod } from "@nestjs/common";
import { ApiDocConfig } from "../interfaces/api-docs-config.interface";
import { METHOD_METADATA } from "@nestjs/common/constants";
import { ApiBadRequestResponse, ApiBearerAuth, ApiHeaders, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";

export function ApiDocDecorator(options: ApiDocConfig): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        // console.log('target, propertyKey, descriptor:::', { target, propertyKey, descriptor });

        const method = RequestMethod[Reflect.getMetadata(METHOD_METADATA, descriptor.value)];
        const requiresAuth = !Reflect.getMetadata('isUnauthenticated', descriptor.value);

        let apiDescription = `class ${target.constructor.name}.${propertyKey.toString()}`;
        if (options.description) {
            apiDescription += ` -- ${options.description}`;
        }

        // Add ApiOperation Decorator
        ApiOperation({
            operationId: `${target.constructor.name}-${propertyKey.toString()}`,
            summary: options.summary,
            description: apiDescription,
            deprecated: options.deprecated || false
        })(target, propertyKey, descriptor);

        // Add ApiResponse Decorator
        ApiResponse({
            ...options.response
        })(target, propertyKey, descriptor);

        // Add HttpCode Decorator
        HttpCode(options.response.status)(target, propertyKey, descriptor);

        // Add Not Found Response
        ApiNotFoundResponse({
            description: 'Entity Not Found'
        })(target, propertyKey, descriptor);

        // Add Internal Server Error
        ApiInternalServerErrorResponse({
            description: 'Internal Server Error'
        })(target, propertyKey, descriptor);

        // Add Bad Request Response - dynamically add based on POST | PUT  Methods
        if (['POST', 'PUT'].includes(method)) {
            ApiBadRequestResponse({
                description: 'Bad Request'
            })(target, propertyKey, descriptor);
        }

        // Add Not Found Response - dynamically added based IsUnauthenticated Decorator
        if (requiresAuth) {
            ApiBearerAuth()(target, propertyKey, descriptor);
        }

        // Add the ApiHeaders if supplied
        if (options.headers?.length > 0) {
            ApiHeaders(options.headers)(target, propertyKey, descriptor);
        }
    };
}