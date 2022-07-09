import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  kind: string;

  @IsInt()
  @IsNotEmpty()
  last_page: number;

  @IsDate()
  @IsNotEmpty()
  action_date: Date;

  @IsString()
  content: string;
}
