import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithJwtUser } from '../auth/auth.controller';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post("create")
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: RequestWithJwtUser) {
    return this.commentService.create(createCommentDto, req.user.id);
  }

  @Get(":id")
  findAll(@Param('id') wrappedId: string) {
    return this.commentService.findAll(wrappedId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req: RequestWithJwtUser) {
    return this.commentService.update(id, updateCommentDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: RequestWithJwtUser) {
    return this.commentService.remove(id, req.user.id);
  }

  @Delete('wrapped/:wrappedId')
  @UseGuards(AuthGuard('jwt'))
  removeByWrappedId(@Param('wrappedId') wrappedId: string, @Req() req: RequestWithJwtUser) {
    return this.commentService.removeByWrappedId(wrappedId, req.user.id);
  }
}
