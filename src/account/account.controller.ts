import { Controller, Get, Param, Query } from '@nestjs/common';
import { Account } from './interface/account.interface';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  //랭킹 조회
  @Get('/ranking')
  getRanking(@Query('kind') kind: string): Account[] {
    return this.accountService.findAll(kind);
  }

  //계정 상세
  @Get('/:id')
  getAccountDetail(@Param('id') userId: string): Account {
    return this.accountService.getOne(userId);
  }
}
