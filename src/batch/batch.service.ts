import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Octokit } from '@octokit/core';
import { AccountService } from 'src/account/account.service';
import { AttendanceService } from 'src/attendance/attendance.service';
import { HistoryService } from 'src/history/history.service';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    private historyService: HistoryService,
    private accountService: AccountService,
    private attendanceService: AttendanceService,
  ) {}

  //히스토리 누적 처리
  @Cron('0 0 0 * * *', { name: 'historyTask' })
  async handleHistory() {
    //히스토리에서 데이터 조회(커밋,풀퀘댓글: action_date, 풀퀘/커밋댓글: last_page 기준)
    const kindArr = ['commits', 'pulls', 'comments', 'pull_comments'];
    let requestObj = {};
    kindArr.forEach(async (item) => {
      let url = process.env.GIT_URL;
      let page = 1;

      const history = await this.historyService.getLastOne(item);
      if (!history) throw new NotFoundException('기록이 없습니다.');
      else {
        const { action_date, last_page } = history;
        const setSince = new Date(action_date);
        if (item === 'pulls' || item === 'comments') page = last_page;

        requestObj = {
          kind: item === 'pull_comments' ? 'comments' : item,
        };

        //각 호출별로 필요한 데이터 셋팅(url, 파라미터)
        if (item === 'commits') {
          url = `${url}{kind}?since={since}&page={page}`;
          requestObj = {
            ...requestObj,
            since: setSince.toISOString(),
            page,
          };
        } else if (item === 'pulls') {
          url = `${url}{kind}?state=all&head=main&page={page}`;
          requestObj = {
            ...requestObj,
            page,
          };
        } else if (item === 'comments') {
          url = `${url}{kind}?page={page}`;
          requestObj = {
            ...requestObj,
            page,
          };
        } else {
          url = `${url}pulls/{kind}?since={since}&page={page}`;
          requestObj = {
            ...requestObj,
            since: setSince.toISOString(),
            page,
          };
        }
        //히스토리 누적 처리
        await this.historyService.create(item, url, page, requestObj);
      }
    });
    this.logger.log(`historyTask Done`);
  }

  //랭킹 업데이트
  @Cron('0 10 0 * * *', { name: 'rankingTask' })
  async handleRanking() {
    //계정별 항목별 카운트 처리
    const accounts = await this.accountService.findAll('');
    accounts.forEach(async (item) => {
      const { user_id } = item;
      let commits = 0, //커밋
        pulls = 0, //풀퀘
        comments = 0; //댓글

      // 히스토리 group by로 가져오기
      const account = await this.historyService.findGroupByKind(user_id);
      account.forEach((element) => {
        const { _id, count } = element;
        if (_id === 'commits') commits = count;
        else if (_id === 'pulls') pulls = count;
        else comments += count;
      });

      //누적 업데이트
      await this.accountService.update({ user_id, commits, pulls, comments });
    });
    this.logger.log(`rankingTask Done`);
  }

  //출석 체크 처리
  @Cron('0 20 0 * * *', { name: 'attedanceTask' })
  async handleAttendance() {
    //히스토리 누적: 유저별 날짜별로 조회
    const accounts = await this.accountService.findAll('');
    accounts.forEach(async (item) => {
      const { user_id, attendances = 0 } = item;
      const requestArr = [];

      //출석일 최대값 구하기(없으면 디폴트 값 셋팅)
      const result = await this.attendanceService.findMaxOne(user_id);
      const maxAttendance = !result
        ? new Date('2022-01-01')
        : result.attendance_date;

      //최근 출석일로부터 출석 리스트 조회
      const attendance = await this.historyService.findAttendanceByUser(
        user_id,
        maxAttendance,
      );
      //출석리스트 배열 셋팅
      attendance.forEach(async (element) => {
        const { _id } = element;
        requestArr.push({ user_id, attendance_date: _id });
      });

      //출석일 누적, 출석일수 업데이트
      await this.attendanceService.create(requestArr);
      await this.accountService.update({
        user_id,
        attendances: attendances + requestArr.length,
      });
    });
    this.logger.log(`attedanceTask Done`);
  }
}
