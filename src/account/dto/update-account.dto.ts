import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-accout.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
