import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';

export class UpdateMovieDto extends PartialType(CreateAccountDto) {}
