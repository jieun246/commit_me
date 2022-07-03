import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History } from './schema/history.schema';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private historyModel: Model<History>,
  ) {}

  // 생성
  async create(body: CreateHistoryDto): Promise<CreateHistoryDto> {
    const { user_id, kind, last_page, content } = body;

    const isHistoryExist = await this.historyModel.exists({
      user_id,
      kind,
      content,
    });

    if (isHistoryExist) {
      throw new UnauthorizedException('이미 존재합니다.');
    }

    try {
      const history = await this.historyModel.create({
        user_id,
        kind,
        last_page,
        content,
      });

      return history;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 조회
  async getOne(kind: string, user_id: string): Promise<CreateHistoryDto> {
    const history = await this.historyModel.findOne({
      $and: [{ user_id }, { kind }],
    });

    return history;
  }
}
