import { Injectable } from '@nestjs/common';
import { CreateWrappedDto } from './dto/create-wrapped.dto';
import { UpdateWrappedDto } from './dto/update-wrapped.dto';

@Injectable()
export class WrappedService {
  create(createWrappedDto: CreateWrappedDto) {
    return 'This action adds a new wrapped';
  }

  findAll() {
    return `This action returns all wrapped`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wrapped`;
  }

  update(id: number, updateWrappedDto: UpdateWrappedDto) {
    return `This action updates a #${id} wrapped`;
  }

  remove(id: number) {
    return `This action removes a #${id} wrapped`;
  }
}
