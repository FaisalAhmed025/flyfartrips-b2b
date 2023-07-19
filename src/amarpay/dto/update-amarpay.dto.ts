import { PartialType } from '@nestjs/swagger';
import { CreateAmarpayDto } from './create-amarpay.dto';

export class UpdateAmarpayDto extends PartialType(CreateAmarpayDto) {}
