import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaOptions } from 'mongoose';
import { IsEmpty, IsInt, IsNotEmpty, IsString } from 'class-validator';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Account {
  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  user_id: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  name: string;

  @IsString()
  @Prop({
    default: '',
  })
  image_url: string;

  @IsString()
  @Prop({
    default: '',
  })
  github_address: string;

  @IsInt()
  @Prop({
    default: 0,
  })
  attendances: number;

  @IsInt()
  @Prop({
    default: 0,
  })
  pulls: number;

  @IsInt()
  @Prop({
    default: 0,
  })
  commits: number;

  @IsInt()
  @Prop({
    default: 0,
  })
  comments: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
