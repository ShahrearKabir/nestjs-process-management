import { HttpCode, RequestMethod } from "@nestjs/common";
import { SchemaApiDocConfig } from "../interfaces/schema-api-docs-config.interface";
import { METHOD_METADATA } from "@nestjs/common/constants";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, PropOptions } from "@nestjs/mongoose";
import { isNumber, isString, isEmail } from "class-validator";

export function SchemaApiDocDecorator(options: SchemaApiDocConfig | PropOptions | any): PropertyDecorator {
    return (target, propertyKey) => {
        // console.log('target, propertyKey:::', { target, propertyKey });

        if (options?.type === String)
            isString
        if (options?.type === Number)
            isNumber

        if (options?.isArray) {
            ApiProperty({
                ...options,
                required: options?.required ? true : false,
            })(target, propertyKey)
            Prop([{
                ...options,
            }])(target, propertyKey)
        }
        else {
            ApiProperty({
                ...options,
                required: options?.required ? true : false,
            })(target, propertyKey)
            Prop({
                ...options,
            })(target, propertyKey)
        }
    }
}