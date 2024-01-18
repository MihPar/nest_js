import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Put, UseFilters, UseGuards } from '@nestjs/common';
import { CommentQueryRepository } from './comment.queryRepository';
import { CommentViewModel } from './comment.type';
import { UserDecorator, UserIdDecorator } from '../../infrastructure/decorator/decorator.user';
import { InputModelContent, InputModelLikeStatusClass, inputModelCommentId, inputModelId } from './comment.class-pipe';
import { CheckRefreshTokenForComments } from '../../infrastructure/guards/comments/bearer.authForComments';
import { HttpExceptionFilter } from '../../exceptionFilters.ts/exceptionFilter';
import { ObjectId } from 'mongodb';
import { commentDBToView } from '../../utils/helpers';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { CheckRefreshTokenForGetComments } from '../../infrastructure/guards/comments/bearer.authGetComment';
import { UserClass } from '../../schema/user.schema';
import { UpdateLikestatus } from './use-case/updateLikeStatus-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentByCommentId } from './use-case/updateCommentByCommentId-use-case';
import { CommentClass } from '../../schema/comment.schema';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentQueryRepository: CommentQueryRepository,
    protected commentService: CommentService,
	protected commentRepository: CommentRepository,
	protected commandBus: CommandBus
  ) {}

  @HttpCode(204)
  @Put('/:commentId/like-status')
  @UseGuards(CheckRefreshTokenForComments)
  @UseFilters(new HttpExceptionFilter())
  async updateByCommentIdLikeStatus(
    @Body() status: InputModelLikeStatusClass,
    @Param() id: inputModelCommentId,
    @UserDecorator() user: UserClass,
    @UserIdDecorator() userId: string,
  ) {
    const findCommentById: CommentClass | null =
      await this.commentQueryRepository.findCommentByCommentId(id.commentId);
    if (!findCommentById) throw new NotFoundException('404');
    const findLike = await this.commentQueryRepository.findLikeCommentByUser(
      id.commentId,
      userId,
    );
    const commentDBBiew = commentDBToView(
      findCommentById,
      findLike?.myStatus ?? null,
    );

	await this.commandBus.execute(new UpdateLikestatus(status, id, userId))
    // await this.commentService.updateLikeStatus(
    //   status.likeStatus,
    //   id.commentId,
    //   userId,
    // );
	return 
  }

  @Put(':commentId')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForComments)
  @UseFilters(new HttpExceptionFilter())
  async updataCommetById(
	@Param() id: inputModelCommentId, 
	@Body() dto: InputModelContent,
	@UserDecorator() user: UserClass,
	@UserIdDecorator() userId: string | null,
	) {
	if(!userId) return null
    const isExistComment = await this.commentQueryRepository.findCommentById(id.commentId, userId);
    if (!isExistComment) throw new BadRequestException("400")
    if (userId.toString() !== isExistComment.commentatorInfo.userId) { throw new ForbiddenException("403")}
	const updateComment: boolean = await this.commandBus.execute(new UpdateCommentByCommentId(id, dto))
    // const updateComment: boolean =
    //   await this.commentService.updateCommentByCommentId(id.commentId, dto.content);
    if (!updateComment) throw new NotFoundException('404');
	return
  }

  @Delete(':commentId')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForComments)
  async deleteCommentById(
	@Param() id: inputModelCommentId,
	@UserDecorator() user: UserClass,
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
    @UserDecorator() user: UserClass,
    @UserIdDecorator() userId: string | null,
  ) {
    if (!userId) return null;
    const getCommentById: CommentViewModel | null =
      await this.commentQueryRepository.findCommentById(dto.id, userId);
    if (!getCommentById) throw new NotFoundException('Blogs by id not found');
    return getCommentById;
  }
}
