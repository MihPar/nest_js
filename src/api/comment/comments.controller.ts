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
//   @Put("comments/:commentId/like-status")
//   async updateCommentLikeStatusByCommentId(
//     @Param('id') commentId: string,
//     @Body() inputModelData: likeStatusType,
//   ) {
//     const userId = req.user.id;
//     const findCommentById: CommentsDB | null =
//       await this.commentQueryRepository.findCommentByCommentId(commentId);

//     const findLike = await this.commentQueryRepository.findLikeCommentByUser(
//       commentId,
//       userId,
//     );
//     const commentDBBiew = commentDBToView(
//       findCommentById,
//       findLike?.myStatus ?? null,
//     );
//     // console.log("findCommentById: ", findCommentById)

//     await this.commentService.updateLikeStatus(
//       inputModelData.likeStatus,
//       commentId,
//       userId,
//     );
//   }

//   @Put('comments/commentId')
//   async updateCommentByCommentId(
//     @Param('id') commentId: string,
//     @Body() imputDataModel: inputModeContentType,
//   ) {
//     const { _id } = req.user;
//     const isExistComment = await this.commentQueryRepository.findCommentById(
//       commentId,
//       _id,
//     );

    // if (!isExistComment) {
    // 	return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    //   }
    //   if (req.user._id.toString() !== isExistComment.commentatorInfo.userId) {
    // 	return res.sendStatus(HTTP_STATUS.FORBIDEN_403);
    //   }

//     const updateComment: boolean =
//       await this.commentService.updateCommentByCommentId(
//         commentId,
//         imputDataModel.content,
//       );
//   }

//   @Delete('comments/commentId')
//   async deleteCommentByCommentId(@Param('id') commentId: string) {
//     const { _id } = req.user;
//     const isExistComment = await this.commentQueryRepository.findCommentById(
//       commentId,
//       _id,
//     );
    //   if (!isExistComment) {
    // 	return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    //   }
    //   if (req.user._id.toString() !== isExistComment.commentatorInfo.userId) {
    // 	return res.sendStatus(HTTP_STATUS.FORBIDEN_403);
    //   }
    // const deleteCommentById: boolean =
    //   await this.commentRepository.deleteComment(commentId);
    //   if (!deleteCommentById) {
    // 	return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    //   } else {
    // 	return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    //   }
//   }
}
