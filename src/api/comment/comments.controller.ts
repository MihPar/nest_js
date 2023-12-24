import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CommentQueryRepository } from './comment.queryRepository';
import { CommentViewModel } from './comment.type';

@Controller('comment')
export class CommentsController {
  constructor(
    protected commentQueryRepository: CommentQueryRepository,
  ) {}

  @Get(':id')
  async getCommentById(@Param('id') id: string) {
    const getCommentById: CommentViewModel | null =
      await this.commentQueryRepository.findCommentById(id);
    if (!getCommentById) throw new NotFoundException("Blogs by id not found")
    return getCommentById
  }
}
