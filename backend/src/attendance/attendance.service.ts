import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance } from './schema/attendnace.schema';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Model } from 'mongoose';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendancetModel: Model<Attendance>,
  ) {}

  //생성
  async create(attendanceArr: Array<object>) {
    //출석 추가
    try {
      const result = await this.attendancetModel.insertMany(attendanceArr, {
        ordered: false,
      });
      console.log(`${result.length}개 누적 성공`);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //날짜 조회
  async findAll(
    startDate: string,
    endDate: string,
  ): Promise<CreateAttendanceDto[]> {
    //해당되는 날짜 조회 후, 오름차순으로 정렬(날짜)
    const attendance = await this.attendancetModel
      .find({
        attendance_date: { $gte: startDate, $lt: endDate },
      })
      .sort({ attendance_date: 1 });

    return attendance;
  }

  //출석일 최대값 조회
  async findMaxOne(user_id: string): Promise<CreateAttendanceDto> {
    return await this.attendancetModel
      .findOne({ user_id })
      .sort({ attendance_date: -1 })
      .limit(1);
  }
}
