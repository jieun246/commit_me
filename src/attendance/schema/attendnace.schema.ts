import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate, IsEmpty, IsString } from 'class-validator';

@Schema()
export class Attendance {
  @IsString()
  @IsEmpty()
  @Prop({
    required: true,
  })
  user_id: string;

  @IsDate()
  @IsEmpty()
  @Prop({
    required: true,
  })
  attendance_date: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
