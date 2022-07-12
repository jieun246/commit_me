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

    //총 페이지 계산
    let page = 0;
    for (let i = 1; ; ) {
      const datas = await octokit.request(
        `GET ${url}?page{page}&since={since}`,
        {
          owner: process.env.GIT_OWNER,
          repo: process.env.GIT_REPO,
          kind: 'commit',
          page: i,
          since: action_date,
        },
      );
      const { data } = datas;
      if (Array.isArray(data) && data.length === 0) {
        console.log(i);
        page = i;
        break;
      }

      i += 1;
    }
    this.logger.log(`Task Called ::: [${page}]`);
  }
}
