import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History } from './schema/history.schema';
import { CreateHistoryDto } from './dto/create-history.dto';
import { Octokit } from '@octokit/core';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private historyModel: Model<History>,
  ) {}

  // 전체 조회
  async findAll(kind: string): Promise<CreateHistoryDto[]> {
    return await this.historyModel.find({ kind });
  }

  // 마지막 데이터 조회
  async getLastOne(kind: string): Promise<CreateHistoryDto> {
    let sortObj = {};
    if (kind === 'commits' || kind === 'pull_comments')
      sortObj = { action_date: -1 };
    else sortObj = { last_page: -1 };

    const history = await this.historyModel
      .findOne({ kind })
      .sort(sortObj)
      .limit(1);

    return history;
  }

  // 날짜별 출석 조회
  async findAttendanceByUser(user_id: string, attendance: Date) {
    //출석일 그 다음 날짜로 셋팅
    const next_max_attendance = new Date(
      attendance.setDate(attendance.getDate() + 1),
    );
    //그 다음 날짜부터 조회하도록 설정
    const pipelie = [
      {
        $match: {
          $and: [{ user_id, action_date: { $gte: next_max_attendance } }],
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$action_date' } },
          count: { $sum: 1 },
        },
      },
    ];
    return await this.historyModel.aggregate(pipelie);
  }

  // 항목별 group 조회
  async findGroupByKind(user_id: string) {
    const pipelie = [
      { $match: { user_id } },
      { $group: { _id: '$kind', count: { $sum: 1 } } },
    ];
    return await this.historyModel.aggregate(pipelie);
  }

  // 삭제
  async delete(kind: string) {
    return await this.historyModel.remove({ kind });
  }

  // 생성
  async create(kind: string, url: string, page: number, requestObj: any) {
    const octokit = new Octokit({
      auth: process.env.GIT_AUTH,
    });

    const historyArr = [];
    let historyObj = {};

    //깃API 연동
    do {
      const datas = await octokit.request(`GET ${url}`, requestObj);

      const { data } = datas;
      if (Array.isArray(data) && data.length === 0) break; //빈값이면 break

      //데이터 셋팅
      for (const item of data) {
        if (kind === 'commits') {
          //커밋
          const {
            sha,
            commit: {
              author: { name, date },
            },
          } = item;
          historyObj = {
            kind,
            user_id: name,
            action_date: date,
            content: sha,
          };
        } else if (kind === 'pulls') {
          //풀퀘
          const {
            number,
            merged_at,
            user: { login },
          } = item;
          historyObj = {
            kind,
            user_id: login,
            action_date: merged_at,
            content: number,
          };
        } else if (kind === 'comments' || kind === 'pull_comments') {
          //댓글
          const {
            body,
            created_at,
            user: { login },
          } = item;
          historyObj = {
            kind,
            user_id: login,
            action_date: created_at,
            content: body,
          };
        }

        //이미 있는 데이터는 array 누적 X(에러 방지용으로 한번 더 검사)
        const isExist = await this.historyModel.exists(historyObj);
        if (!isExist) {
          historyArr.push({
            last_page: page,
            ...historyObj,
          });
        }
      }
      //페이지 및 파라미터 수정
      page += 1;
      requestObj = {
        ...requestObj,
        page,
      };
    } while (true);

    // 데이터 일괄 등록
    try {
      const result = await this.historyModel.insertMany(historyArr, {
        ordered: false,
      });
      console.log(`${result.length}개만 누적 성공`);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
