import { IsEmpty, IsInt, IsString } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  @IsEmpty()
  user_id: string;

  @IsString()
  @IsEmpty()
  kind: string;

  @IsInt()
  @IsEmpty()
  last_page: number;

  @IsString()
  content: string;
}
