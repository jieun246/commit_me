import { IsInt, IsString, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  readonly user_id: string;
  @IsString()
  readonly name: string;
  @IsString()
  readonly image_url: string;
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
