import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('commitme')
export class CommitmeController {
  //전체리스트
  @Get()
  getList(): string {
    return '전체 리스트';
  }

  //출석체크 조회
  @Get('/attendace')
  getAttendance(@Query('seach_date') searchDate: Date): string {
    return `출석 체크`;
  }

  //랭킹 조회
  @Get('/ranking')
  getRanking(@Query('kind') kind: string): string {
    return '랭킹';
  }

  //계정 상세
  @Get('/account/:id')
  getAccountDetail(@Param('id') userId: string): string {
    return '계정 상세';
  }
}
