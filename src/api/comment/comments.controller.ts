import { Controller, Get, HttpCode, NotFoundException, Param } from '@nestjs/common';
import { CommentQueryRepository } from './comment.queryRepository';
import { CommentViewModel } from './comment.type';
import { Users } from '../users/user.class';
import { UserDecorator, UserIdDecorator } from '../../infrastructure/decorator/decorator.user';

@Controller('comments')
export class CommentsController {
  constructor(protected commentQueryRepository: CommentQueryRepository) {}

  @Get(':id')
  @HttpCode(200)
  async getCommentById(
    @Param('id') id: string,
    @UserDecorator() user: Users,
    @UserIdDecorator() userId: string | null,
  ) {
	if(!userId) return null
    const getCommentById: CommentViewModel | null =
      await this.commentQueryRepository.findCommentById(id, userId);
    if (!getCommentById) throw new NotFoundException('Blogs by id not found');
    return getCommentById;
  }
}
