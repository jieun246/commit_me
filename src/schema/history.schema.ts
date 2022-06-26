import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HistoryDocument = History & Document;

@Schema()
export class History {
  @Prop()
  kind: string;

  @Prop()
  user_id: string;

  @Prop()
  last_page: number;

  @Prop()
  action_date: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(History);
