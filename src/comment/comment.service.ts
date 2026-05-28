import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {

  constructor(
    private readonly commentRepository: CommentRepository,
  ) { }

  create(createCommentDto: CreateCommentDto, userId: number) {
    return this.commentRepository.createComment(createCommentDto.wrappedId, userId, createCommentDto.content);
  }

  findAll(wrappedId: string) {
    return this.commentRepository.getCommentsByWrappedId(wrappedId);
  }

  update(commentId: string, updateCommentDto: UpdateCommentDto, userId: number) {
    return this.commentRepository.updateComment(commentId, userId, updateCommentDto.content);
  }

  remove(id: string, userId: number) {
    return this.commentRepository.deleteComment(id, userId);
  }

  removeByWrappedId(wrappedId: string, userId: number) {
    return this.commentRepository.deleteCommentsByWrappedId(wrappedId, userId);
  }

}
