import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WrappedService } from './wrapped.service';
import { CreateWrappedDto } from './dto/create-wrapped.dto';
import { UpdateWrappedDto } from './dto/update-wrapped.dto';

@Controller('wrapped')
export class WrappedController {
  constructor(private readonly wrappedService: WrappedService) {}

  @Post()
  create(@Body() createWrappedDto: CreateWrappedDto) {
    return this.wrappedService.create(createWrappedDto);
  }

  @Get()
  findAll() {
    return this.wrappedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wrappedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWrappedDto: UpdateWrappedDto) {
    return this.wrappedService.update(+id, updateWrappedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wrappedService.remove(+id);
  }
}
