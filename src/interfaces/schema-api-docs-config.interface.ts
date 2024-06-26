import { Type } from "@nestjs/common";
import { PropOptions } from "@nestjs/mongoose"
import { ApiPropertyOptions } from "@nestjs/swagger"
import mongoose, { IndexDirection, IndexOptions, Model } from "mongoose"

type Schematypes = PropOptions | ApiPropertyOptions  // string | Number | Boolean;

export interface SchemaApiDocConfig {
    type?: Type<unknown> | Function | [Function] | string | Record<string, any>;
    default?: any;
    enum?: Array<string | number | null> | ReadonlyArray<string | number | null> | { values: Array<string | number | null> | ReadonlyArray<string | number | null>, message?: string } | { [path: string]: string | number | null };
    required?: boolean | (() => boolean) | [boolean, string] | [() => boolean, string];
    index?: boolean | IndexDirection | IndexOptions
    autopopulate?: boolean
    ref?: string | Model<any> | ((this: any, doc: any) => string | Model<any>)
    isArray?: boolean
}