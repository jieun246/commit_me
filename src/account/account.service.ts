import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDto } from './dto/request.accout.dto';
import { Account } from './schema/account.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  //계정 생성
  async create(body: AccountDto) {
    const { user_id, name, image_url, github_address } = body;

    const isUserExist = await this.accountModel.exists({ user_id });

    if (isUserExist) {
      throw new UnauthorizedException('해당하는 아이디가 존재합니다.');
    }

    const account = await this.accountModel.create({
      user_id,
      name,
      image_url,
      github_address,
    });

    return account.readOnlyData;
  }

  //계정 상세
  async getOne(_id: object): Promise<AccountDto> {
    const account = await this.accountModel.findById(_id);
    if (!account) {
      throw new NotFoundException(`Account with ID ${_id} not found.`);
    }
    return account;
  }

  //랭킹순으로 정렬 추가
  async findAll(kind: string): Promise<Account[]> {
    let orderObj = {};
    if (kind === 'attendance') {
      orderObj = { attendances: -1 };
    } else if (kind === 'commit') {
      orderObj = { commits: -1 };
    } else if (kind === 'pull') {
      orderObj = { pulls: -1 };
    } else if (kind === 'comment') {
      orderObj = { comments: -1 };
    }
    return await this.accountModel.find().sort(orderObj);
  }

  //랭킹 업데이트
  // async update(body: AccountDto) {
  //   const {  _id, } = body;

  //   const account = await this.accountModel.findByIdAndUpdate(;
  // }
}
