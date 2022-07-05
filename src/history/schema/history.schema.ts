import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaOptions } from 'mongoose';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class History {
  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  user_id: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  kind: string;

  @IsInt()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  last_page: number;

  @IsString()
  @Prop()
  content: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
