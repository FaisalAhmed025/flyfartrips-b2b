import { Injectable } from '@nestjs/common';
import { CreateAmarpayDto } from './dto/create-amarpay.dto';
import { UpdateAmarpayDto } from './dto/update-amarpay.dto';

@Injectable()
export class AmarpayService {
  create(createAmarpayDto: CreateAmarpayDto) {
    return 'This action adds a new amarpay';
  }

  findAll() {
    return `This action returns all amarpay`;
  }

  findOne(id: number) {
    return `This action returns a #${id} amarpay`;
  }

  update(id: number, updateAmarpayDto: UpdateAmarpayDto) {
    return `This action updates a #${id} amarpay`;
  }

  remove(id: number) {
    return `This action removes a #${id} amarpay`;
  }
}
