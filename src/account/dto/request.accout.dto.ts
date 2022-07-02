import { IsEmpty, IsInt, IsString, Min } from 'class-validator';

export class AccountDto {
  @IsString()
  @IsEmpty()
  user_id: string;

  @IsString()
  @IsEmpty()
  name: string;

  @IsString()
  image_url: string;

  @IsString()
  readonly github_address: string;

  @IsInt()
  @Min(0)
  readonly attendances: number;

  @IsInt()
  @Min(0)
  readonly pulls: number;

  @IsInt()
  @Min(0)
  readonly commits: number;

  @IsInt()
  @Min(0)
  readonly comments: number;
}
