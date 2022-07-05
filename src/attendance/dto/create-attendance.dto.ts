import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  attendance_date: Date;
}
