import { PartialType } from '@nestjs/swagger';
import { CreateBkashDto } from './create-bkash.dto';

export class UpdateBkashDto extends PartialType(CreateBkashDto) {}
