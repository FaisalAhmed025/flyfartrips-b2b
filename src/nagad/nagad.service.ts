import { Injectable } from '@nestjs/common';
import { CreateNagadDto } from './dto/create-nagad.dto';
import { UpdateNagadDto } from './dto/update-nagad.dto';

@Injectable()
export class NagadService {
  create(createNagadDto: CreateNagadDto) {
    return 'This action adds a new nagad';
  }

  findAll() {
    return `This action returns all nagad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nagad`;
  }

  update(id: number, updateNagadDto: UpdateNagadDto) {
    return `This action updates a #${id} nagad`;
  }

  remove(id: number) {
    return `This action removes a #${id} nagad`;
  }
}
