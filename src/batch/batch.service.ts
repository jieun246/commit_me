import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Octokit } from '@octokit/core';
import { HistoryService } from 'src/history/history.service';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(private historyService: HistoryService) {}

  //히스토리 누적 처리
  @Cron('*/60 * * * * *', { name: 'historyTask' })
  async handleHistory() {
    //깃 연동
    const octokit = new Octokit({
      auth: process.env.GIT_AUTH,
    });
    const url = process.env.GIT_URL;

    //히스토리에서 데이터 조회(커밋,풀퀘댓글: action_date, 풀퀘/커밋댓글: last_page 기준)
    const history = await this.historyService.getOne('commits');
    if (!history) throw new NotFoundException('기록이 없습니다.');

    const { action_date } = history;
    const setSince = new Date(action_date); //ISO 변환

    //데이터 셋팅
    let page = 1;
    const historyArr = [];
    let historyObj = {};
    do {
      //GIT API 호출(data가 있으면 loop, 없으면 break)
      const datas = await octokit.request(
        `GET ${url}/{kind}?since={since}&page={page}`,
        {
          kind: 'commits',
          since: setSince.toISOString(),
          page: page,
        },
      );
      const { data } = datas;
      if (Array.isArray(data) && data.length === 0) break; //빈값이면 break
      for (const item of data) {
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
        //이미 있는 데이터는 array 누적 X(에러 방지용으로 한번 더 검사)
        const isExist = await this.historyService.checkOne(
          name,
          'commits',
          date,
          sha,
        );
        if (!isExist) {
          historyArr.push({
            kind: 'commits',
            last_page: page,
            ...historyObj,
          });
        }
      }
      page += 1;
    } while (true);
    //데이터 누적 처리
    try {
      await this.historyService.creatTest(historyArr);
      this.logger.log(`Task Done ::: [${page - 1}]`);
    } catch (error) {
      this.logger.error(`Task error ::: ${error}`);
      throw error;
    }
  }
}
