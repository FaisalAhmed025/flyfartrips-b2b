import { PartialType } from '@nestjs/swagger';
import { CreateNagadDto } from './create-nagad.dto';

export class UpdateNagadDto extends PartialType(CreateNagadDto) {}
