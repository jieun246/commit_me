import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop()
  user_id: string;

  @Prop()
  name: string;

  @Prop()
  image_url: string;

  @Prop()
  github_address: string;

  @Prop()
  attendances: number;

  @Prop()
  pulls: number;

  @Prop()
  commits: number;

  @Prop()
  comments: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
