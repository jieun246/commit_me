import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  //생성
  // @Post('/register')
  // async registerAttendance(@Body() body: CreateAttendanceDto) {
  //   return await this.attendanceService.create(body);
  // }

  //출석체크 조회
  @Get('/search')
  async getAttendance(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.attendanceService.findAll(startDate, endDate);
  }
}
