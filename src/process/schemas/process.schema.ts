import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument, Model } from 'mongoose';
import { SchemaApiDocDecorator } from 'src/decorators/schema-api-doc-config.decorator';

export type ProcessDocument = HydratedDocument<Process>;
@Schema()
export class Process {
  @SchemaApiDocDecorator({ type: Number, unique: true })
  pid: number;
  
  // @SchemaApiDocDecorator({ required: true })
  // name: string;

  @ApiProperty()
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ProcessSchema = SchemaFactory.createForClass(Process);

ProcessSchema.pre('save', async function (next) {
  const currentBlockModel = <Model<Process>>this.constructor;
  // Set Process Id
  const dataObj: { pid: number } = await currentBlockModel.findOne({}).select('pid').sort({ pid: -1 }).lean();
  this.pid = dataObj?.pid ? (dataObj?.pid) + 1 : 1

  next();
});