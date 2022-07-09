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
    return this.historyModel.find({ kind });
  }

  // 생성
  async create(kind: string, page: number): Promise<CreateHistoryDto[]> {
    const octokit = new Octokit({
      auth: process.env.GIT_AUTH,
    });

    let url = process.env.GIT_URL;
    let setKind = kind;

    //깃API 주소 셋팅
    if (setKind === 'comments2') {
      url = `${url}/pulls/{kind}?page={page}`;
    } else {
      url = `${url}/{kind}?page={page}`;
      if (kind === 'pulls') url = `${url}&state=all`;
    }

    if (setKind === 'comments2') setKind = 'comments';

    //깃API 연동
    // 1. 초기 데이터 일괄 처리
    // 2. 마지막 데이터 기준으로 깃 API 연동 > 데이터 누적 처리
    const datas = await octokit.request(`GET ${url}`, {
      owner: process.env.GIT_OWNER,
      repo: process.env.GIT_REPO,
      kind: setKind,
      page: page,
    });

    const { data } = datas;
    const historyArr = [];
    let historyObj = {};
    let isHistoryExist = '';

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

      //데이터 있는지 확인
      isHistoryExist = await this.historyModel.findOne({
        kind: setKind,
        last_page: page,
        ...historyObj,
      });

      //데이터가 없는 것만 배열에 추가
      if (!isHistoryExist) {
        historyArr.push({
          kind: setKind,
          last_page: page,
          ...historyObj,
        });
      }
    }

    // 데이터 일괄 등록
    try {
      this.historyModel.insertMany(historyArr);
      return this.historyModel.find({ kind });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
