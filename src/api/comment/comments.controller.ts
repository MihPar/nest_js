import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Put, UseFilters, UseGuards } from '@nestjs/common';
import { CommentQueryRepository } from './comment.queryRepository';
import { CommentViewModel } from './comment.type';
import { Users } from '../users/user.class';
import { UserDecorator, UserIdDecorator } from '../../infrastructure/decorator/decorator.user';
import { CommentsDB, InputModelContent, InputModelLikeStatusClass, inputModelCommentId, inputModelId } from './comment.class';
import { CheckRefreshTokenForComments } from '../../infrastructure/guards/comments/bearer.authForComments';
import { HttpExceptionFilter } from '../../exceptionFilters.ts/exceptionFilter';
import { ObjectId } from 'mongodb';
import { commentDBToView } from 'utils/helpers';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { CheckRefreshTokenForGetComments } from '../../infrastructure/guards/comments/bearer.authGetComment';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentQueryRepository: CommentQueryRepository,
    protected commentService: CommentService,
	protected commentRepository: CommentRepository
  ) {}

//   @HttpCode(204)
//   @Put('/:commentId/like-status')
//   @UseGuards(CheckRefreshTokenForComments)
//   @UseFilters(new HttpExceptionFilter())
//   async updateByCommentIdLikeStatus(
//     @Body() status: InputModelLikeStatusClass,
//     @Param() id: inputModelCommentId,
//     @UserDecorator() user: Users,
//     @UserIdDecorator() userId: ObjectId,
//   ) {
//     const findCommentById: CommentsDB | null =
//       await this.commentQueryRepository.findCommentByCommentId(id.commentId);
//     if (!findCommentById) throw new NotFoundException('404');
//     const findLike = await this.commentQueryRepository.findLikeCommentByUser(
//       id.commentId,
//       userId,
//     );
//     const commentDBBiew = commentDBToView(
//       findCommentById,
//       findLike?.myStatus ?? null,
//     );

//     await this.commentService.updateLikeStatus(
//       status.likeStatus,
//       id.commentId,
//       userId,
//     );
//   }

  @Put(':commentId')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForComments)
  @UseFilters(new HttpExceptionFilter())
  async updataCommetById(
	@Param() id: inputModelCommentId, 
	@Body() dto: InputModelContent,
	@UserDecorator() user: Users,
	@UserIdDecorator() userId: string | null,
	) {
	if(!userId) return null
    const isExistComment = await this.commentQueryRepository.findCommentById(id.commentId, userId);
    if (!isExistComment) throw new NotFoundException("404")
    if (userId.toString() !== isExistComment.commentatorInfo.userId) { throw new ForbiddenException("403")}
    const updateComment: boolean =
      await this.commentService.updateCommentByCommentId(id.commentId, dto.content);
    if (!updateComment) throw new NotFoundException('404');
  }

  @Delete(':commentId')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForComments)
  async deleteCommentById(
	@Param() id: inputModelCommentId,
	@UserDecorator() user: Users,
	@UserIdDecorator() userId: string | null
	) {
		if(!userId) return null
    	const isExistComment = await this.commentQueryRepository.findCommentById(id.commentId, userId);
    if (!isExistComment) throw new NotFoundException("404")

    if (userId.toString() !== isExistComment.commentatorInfo.userId) { throw new ForbiddenException("403")}

    const deleteCommentById: boolean =
      await this.commentRepository.deleteComment(id.commentId);
    if (!deleteCommentById) throw new NotFoundException('404');
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(CheckRefreshTokenForGetComments)
  async getCommentById(
    @Param() dto: inputModelId,
    @UserDecorator() user: Users,
    @UserIdDecorator() userId: string | null,
  ) {
    if (!userId) return null;
    const getCommentById: CommentViewModel | null =
      await this.commentQueryRepository.findCommentById(dto.id, userId);
    if (!getCommentById) throw new NotFoundException('Blogs by id not found');
    return getCommentById;
  }
}
