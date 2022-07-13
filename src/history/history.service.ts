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
  async getOne(kind: string): Promise<CreateHistoryDto> {
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

  // 값이 있는지 확인
  async checkOne(
    user_id: string,
    kind: string,
    action_date: Date,
    content: string,
  ) {
    const isExist = await this.historyModel.exists({
      user_id,
      kind,
      action_date,
      content,
    });

    return isExist;
  }

  // 삭제
  async delete(kind: string) {
    return await this.historyModel.remove({ kind });
  }

  // 생성 테스트
  async creatTest(historyArr: Array<CreateHistoryDto>) {
    const result = await this.historyModel.insertMany(historyArr, {
      ordered: false,
    });
    console.log(`${result.length}개만 누적 성공`);
    return result;
  }

  // 생성 : Promise<CreateHistoryDto[]>
  async create(kind: string, page: number) {
    const octokit = new Octokit({
      auth: process.env.GIT_AUTH,
    });

    let url = process.env.GIT_URL;
    let setKind = kind;

    //깃API 주소 셋팅
    if (setKind === 'pull_comments') {
      url = `${url}/pulls/{kind}?page={page}&sort=created_at&direction=asc`;
    } else {
      url = `${url}/{kind}?page={page}`;
      if (kind === 'pulls') url = `${url}&state=all`;
    }

    if (setKind === 'pull_comments') setKind = 'comments';

    //깃API 연동
    //// 1. 초기 데이터 일괄 처리
    //// 2. 마지막 데이터 기준으로 깃 API 연동 > 데이터 누적 처리
    const datas = await octokit.request(`GET ${url}`, {
      kind: setKind,
      page: page,
    });

    const { data } = datas;
    const historyArr = [];
    let historyObj = {};

    //데이터 셋팅
    for (const item of data) {
      if (setKind === 'commits') {
        //커밋
        const {
          sha,
          commit: {
            author: { name, date },
          },
        } = item;
        historyObj = {
          user_id: name,
          action_date: date,
          content: sha,
        };
      } else if (setKind === 'pulls') {
        //풀퀘
        const {
          number,
          merged_at,
          user: { login },
        } = item;
        historyObj = {
          user_id: login,
          action_date: merged_at,
          content: number,
        };
      } else if (setKind === 'comments') {
        //댓글
        const {
          body,
          created_at,
          user: { login },
        } = item;
        historyObj = {
          user_id: login,
          action_date: created_at,
          content: body,
        };
      }

      historyArr.push({
        kind,
        last_page: page,
        ...historyObj,
      });
    }

    // 데이터 일괄 등록
    console.log(historyArr);
    // try {
    //   const result = await this.historyModel.insertMany(historyArr, {
    //     ordered: false,
    //   });
    //   console.log(`${result.length} documents were inserted`);
    //   return result;
    // } catch (error) {
    //   console.log(error);
    //   throw error;
    // }
  }
}
