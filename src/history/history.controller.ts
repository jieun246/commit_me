import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  //히스토리 생성
  @Post('/register')
  async registerHistory(@Body() body: CreateHistoryDto) {
    return await this.historyService.create(body);
  }

  //히스토리 조회
  @Get('/detail')
  async getHistory(@Query('kind') kind: string, @Query('id') id: string) {
    return await this.historyService.getOne(kind, id);
  }
}
