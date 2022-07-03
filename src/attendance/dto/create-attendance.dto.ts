import { IsDate, IsEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsEmpty()
  user_id: string;

  @IsDate()
  @IsEmpty()
  attendance_date: Date;
}
