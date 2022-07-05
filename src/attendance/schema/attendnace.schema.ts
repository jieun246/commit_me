import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

@Schema()
export class Attendance {
  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  user_id: string;

  @IsNotEmpty()
  @Prop({
    required: true,
  })
  attendance_date: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
