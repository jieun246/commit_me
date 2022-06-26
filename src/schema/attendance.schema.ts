import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema()
export class Attendance {
  @Prop()
  user_id: string;

  @Prop()
  attendance_date: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
