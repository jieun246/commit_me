import { Controller, Get, Post, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  //전체 조회
  @Get('')
  async getHistoryAll(@Query('kind') kind: string) {
    return await this.historyService.findAll(kind);
  }

  //히스토리 생성
  @Post('/register')
  async registerHistory(
    @Query('kind') kind: string,
    @Query('page') page: number,
  ) {
    return await this.historyService.create(kind, page);
  }
}
