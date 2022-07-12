import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  //전체 조회
  @Get('')
  async getHistoryAll(@Query('kind') kind: string) {
    return await this.historyService.findAll(kind);
  }

  //최근값 조회
  @Get('/detail')
  async getHistory(@Query('kind') kind: string) {
    return await this.historyService.getOne(kind);
  }

  //히스토리 생성
  @Post('/register')
  async registerHistory(
    @Query('kind') kind: string,
    @Query('page') page: number,
  ) {
    return await this.historyService.create(kind, page);
  }

  @Delete('/remove')
  async deleteHistory(@Query('kind') kind: string) {
    return await this.historyService.delete(kind);
  }
}
