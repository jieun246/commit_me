import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-account.dto';
import { Account } from './interface/account.interface';

@Injectable()
export class AccountService {
  private readonly accounts: Account[] = [];

  create(account: Account) {
    this.accounts.push(account);
  }

  //랭킹순으로 정렬 추가
  findAll(kind: string): Account[] {
    return this.accounts;
  }

  //계정 상세
  getOne(id: string): Account {
    const account = this.accounts.find((value) => value.id === id);
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found.`);
    }
    return account;
  }

  //랭킹 업데이트
  update(id: string, updateData: UpdateMovieDto) {
    const account = this.getOne(id);
    this.accounts.push({ ...account, ...updateData });
  }
}
