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

    //날짜 추가 처리
    const newDate = new Date(attendance_date); //원 날짜
    const next_attendance_date = newDate.setDate(newDate.getDate() + 1); //다음 날짜

    //날짜 조회
    const isAttendanceExist = await this.attendancetModel.exists({
      $and: [
        { user_id },
        {
          attendance_date: { $gte: attendance_date, $lt: next_attendance_date },
        },
      ],
    });

    if (isAttendanceExist) {
      throw new UnauthorizedException('이미 출석 체크 처리했습니다.');
    }

    //출석 추가
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
}
