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
  async create(body: CreateAttendanceDto): Promise<CreateAttendanceDto> {
    const { user_id, attendance_date } = body;

    const isAttendanceExist = await this.attendancetModel.exists({
      $and: [{ user_id }, { attendance_date }],
    });

    if (isAttendanceExist) {
      throw new UnauthorizedException('이미 출석 체크 처리했습니다.');
    }

    try {
      const attendance = await this.attendancetModel.create({
        user_id,
        attendance_date,
      });

      return attendance;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //날짜 조회
  async findAll(
    startDate: Date,
    endDate: Date,
  ): Promise<CreateAttendanceDto[]> {
    const attendance = await this.attendancetModel
      .find({ attendance_date: { $gte: startDate, $lt: endDate } })
      .sort({ attendance_date: 1 });

    return attendance;
  }
}
