import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-accout.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './schema/account.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  //계정 생성
  async create(body: CreateAccountDto): Promise<CreateAccountDto> {
    const { user_id, name, image_url, github_address } = body;

    //아이디 유무 체크
    const isUserExist = await this.accountModel.exists({ user_id });
    if (isUserExist) {
      throw new UnauthorizedException('해당하는 아이디가 존재합니다.');
    }

    //계정 생성
    try {
      const account = await this.accountModel.create({
        user_id,
        name,
        image_url,
        github_address,
      });

      return account;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //계정 상세
  async getOne(user_id: string): Promise<CreateAccountDto> {
    const account = await this.accountModel.findOne({ user_id });
    if (!account) {
      throw new NotFoundException(`${user_id} ID not found.`);
    }
    return account;
  }

  //랭킹순으로 정렬 추가
  async findAll(kind: string): Promise<CreateAccountDto[]> {
    let orderObj = {};
    //해당되는 항목으로 내림차순 정렬
    if (kind === 'attendance') {
      //출석
      orderObj = { attendances: -1 };
    } else if (kind === 'commit') {
      //커밋
      orderObj = { commits: -1 };
    } else if (kind === 'pull') {
      //풀퀘
      orderObj = { pulls: -1 };
    } else if (kind === 'comment') {
      //댓글
      orderObj = { comments: -1 };
    }
    return await this.accountModel.find().sort(orderObj);
  }

  //랭킹 업데이트
  async update(body: UpdateAccountDto): Promise<UpdateAccountDto> {
    const { user_id } = body;

    //계정 찾기
    const account = await this.accountModel.findOne({ user_id });
    if (!account) {
      throw new NotFoundException(`ID not found.`);
    }
    const { _id } = account;

    //업데이트 처리
    try {
      const rakingUpdate = await this.accountModel.findByIdAndUpdate(
        _id,
        body,
        { new: true },
      );

      return rakingUpdate;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
