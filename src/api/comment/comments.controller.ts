import { Body, Controller, Get, HttpCode, NotFoundException, Param, Put } from '@nestjs/common';
import { CommentQueryRepository } from './comment.queryRepository';
import { CommentViewModel } from './comment.type';
import { Users } from '../users/user.class';
import { UserDecorator, UserIdDecorator } from '../../infrastructure/decorator/decorator.user';
import { CommentsDB, InputModelStatusClass } from './comment.class';

@Controller('comments')
export class CommentsController {
  constructor(protected commentQueryRepository: CommentQueryRepository) {}

  @HttpCode(204)
  @Put("/:commentId/like-status")
  async updateByCommentIdLikeStatus(@Body() inputModelStaus: InputModelStatusClass,
  @UserDecorator() user: Users,
  @UserIdDecorator() userId: string | null,) {
	const { commentId } = req.params;
    // console.log("commentId: ", commentId)

    const { likeStatus } = req.body;
    // console.log("likeStatus: ", req.body.likeStatus)

    // const userId = req.user.id;
    // console.log("userId: ", req.user.id)

    const findCommentById: CommentsDB | null =
      await this.commentQueryRepository.findCommentByCommentId(commentId);
    if (!findCommentById) throw new NotFoundException("404")
    const findLike = await this.commentQueryRepository.findLikeCommentByUser(
      commentId,
      userId
    );
    const commentDBBiew = commentDBToView(
      findCommentById,
      findLike?.myStatus ?? null
    );
    // console.log("findCommentById: ", findCommentById)

    let updateLikeStatus = await this.commentService.updateLikeStatus(
      likeStatus,
      commentId,
      userId
    );
    // console.log(updateLikeStatus)
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  } 


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
