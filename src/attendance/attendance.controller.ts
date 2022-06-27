import { Controller, Get, Query } from '@nestjs/common';
import { Attendance } from './interface/attendance.interface';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  //출석체크 조회
  @Get('/search')
  getAttendance(@Query('seach_date') searchDate: Date): Attendance[] {
    return this.attendanceService.findAll(searchDate);
  }
}
