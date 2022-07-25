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
    return await this.historyService.getLastOne(kind);
  }

  @Delete('/remove')
  async deleteHistory(@Query('kind') kind: string) {
    return await this.historyService.delete(kind);
  }
}
