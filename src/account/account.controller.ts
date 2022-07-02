import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './dto/request.accout.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  //계정 생성
  @Post('/join')
  async joinAccount(@Body() body: AccountDto) {
    return await this.accountService.create(body);
  }

  //계정 상세
  @Get('/:id')
  async getAccountDetail(@Param('id') userId: object) {
    return await this.accountService.getOne(userId);
  }

  //랭킹 조회
  @Get('/ranking')
  async getRanking(@Query('kind') kind: string) {
    return await this.accountService.findAll(kind);
  }
}
