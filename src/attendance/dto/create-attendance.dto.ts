import { IsDate, IsInt, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  readonly attendance_no: string;
  @IsString()
  readonly user_id: string;
  @IsDate()
  readonly attendance_date: Date;
}
