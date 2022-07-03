import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaOptions } from 'mongoose';
import { IsEmpty, IsInt, IsString } from 'class-validator';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class History {
  @IsString()
  @IsEmpty()
  @Prop({
    required: true,
  })
  user_id: string;

  @IsString()
  @IsEmpty()
  @Prop({
    required: true,
  })
  kind: string;

  @IsInt()
  @IsEmpty()
  @Prop({
    required: true,
  })
  last_page: number;

  @IsString()
  @Prop()
  content: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
