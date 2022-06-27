import { Injectable } from '@nestjs/common';
import { Attendance } from './interface/attendance.interface';

@Injectable()
export class AttendanceService {
  private readonly attendances: Attendance[] = [];

  //생성
  create(attendance: Attendance) {
    this.attendances.push(attendance);
  }

  //날짜 조회
  findAll(searchDate: Date): Attendance[] {
    return this.attendances;
  }
}
