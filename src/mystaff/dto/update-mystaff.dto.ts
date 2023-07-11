import { PartialType } from '@nestjs/swagger';
import { CreateMystaffDto } from './create-mystaff.dto';

export class UpdateMystaffDto extends PartialType(CreateMystaffDto) {}
