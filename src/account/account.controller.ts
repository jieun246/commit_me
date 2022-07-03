import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-accout.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  //계정 생성
  @Post('/join')
  async joinAccount(@Body() body: CreateAccountDto) {
    return await this.accountService.create(body);
  }

  //계정 상세
  @Get('/:id')
  async getAccountDetail(@Param('id') userId: string) {
    return await this.accountService.getOne(userId);
  }

  //랭킹 조회
  @Get('/ranking')
  async getRanking(@Query('kind') kind: string) {
    return await this.accountService.findAll(kind);
  }

  //건수 업데이트
  @Put('/ranking/:id')
  async updateRanking(@Param('id') id: object, @Body() body: UpdateAccountDto) {
    return await this.accountService.update(id, body);
  }
}
