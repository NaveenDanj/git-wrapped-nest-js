import { HttpException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CommentRepository {

    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>
    ) { }

    async createComment(wrappedId: string, userId: number, content: string): Promise<Comment> {
        const comment = this.commentRepository.create({ wrappedId, userId, content });
        return await this.commentRepository.save(comment);
    }

    async getCommentsByWrappedId(wrappedId: string): Promise<Comment[]> {
        return await this.commentRepository.find({ where: { wrappedId }, order: { createdAt: 'DESC' } });
    }

    async updateComment(commentId: string, userId: number, content: string) {

        const comment = await this.commentRepository.findOne({ where: { id: commentId, userId } })

        if (!comment) {
            throw new HttpException('Comment not found or unauthorized', 404);
        }

        comment.content = content;
        return await this.commentRepository.save(comment);
    }

    async deleteComment(commentId: string, userId: number) {
        const comment = await this.commentRepository.findOne({ where: { id: commentId, userId } });
        if (!comment) {
            throw new HttpException('Comment not found or unauthorized', 404);
        }

        const res = await this.commentRepository.delete({ id: commentId });

        if (res.affected === 0) {
            throw new HttpException('Failed to delete comment', 400);
        }

        return
    }

    async deleteCommentsByWrappedId(wrappedId: string, userId: number) {
        const res = await this.commentRepository.delete({ wrappedId, userId });

        if (res.affected === 0) {
            throw new HttpException('Failed to delete comments', 400);
        }

        return
    }

}