import { PartialType } from '@nestjs/mapped-types';
import { AuthResponseDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(AuthResponseDto) {}
