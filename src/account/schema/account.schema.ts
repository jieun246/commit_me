import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaOptions } from 'mongoose';
import { IsEmpty, IsInt, IsString } from 'class-validator';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Account {
  @IsString()
  @IsEmpty()
  @Prop({
    required: true,
  })
  user_id: string;

  @IsString()
  @IsEmpty()
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

  readonly readOnlyData: { user_id: string; name: string };
}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.virtual('readOnlyData').get(function (this: Account) {
  return {
    user_id: this.user_id,
    name: this.name,
  };
});
