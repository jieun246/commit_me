import { IsEmpty, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  readonly user_id: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly image_url: string;

  @IsString()
  readonly github_address: string;

  @IsInt()
  @Min(0)
  attendances: number;

  @IsInt()
  @Min(0)
  pulls: number;

  @IsInt()
  @Min(0)
  commits: number;

  @IsInt()
  @Min(0)
  comments: number;
}
