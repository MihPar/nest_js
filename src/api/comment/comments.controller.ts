import { CommentRepository } from './comment.repository';
import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { likeStatusType } from '../likes/likes.type';
import { CommentsDB } from './comment.class';
import { CommentQueryRepository } from './comment.queryRepository';
import { commentDBToView } from 'src/utils/helpers';
import { CommentService } from './comment.service';
import { CommentViewModel, inputModeContentType } from './comment.type';

@Controller()
export class CommentsController {
  constructor(
    protected commentQueryRepository: CommentQueryRepository,
    protected commentService: CommentService,
    protected commentRepository: CommentRepository,
  ) {}

  @Put(':id')
  async updateCommentLikeStatusByCommentId(
    @Param('id') commentId: string,
    @Body() inputModelData: likeStatusType,
  ) {
    const userId = req.user.id;
    const findCommentById: CommentsDB | null =
      await this.commentQueryRepository.findCommentByCommentId(commentId);

    const findLike = await this.commentQueryRepository.findLikeCommentByUser(
      commentId,
      userId,
    );
    const commentDBBiew = commentDBToView(
      findCommentById,
      findLike?.myStatus ?? null,
    );
    // console.log("findCommentById: ", findCommentById)

    await this.commentService.updateLikeStatus(
      inputModelData.likeStatus,
      commentId,
      userId,
    );
  }

  @Put('id')
  async updateCommentByCommentId(
    @Param('id') commentId: string,
    @Body() imputDataModel: inputModeContentType,
  ) {
    const { _id } = req.user;
    const isExistComment = await this.commentQueryRepository.findCommentById(
      commentId,
      _id,
    );

    // if (!isExistComment) {
    // 	return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    //   }
    //   if (req.user._id.toString() !== isExistComment.commentatorInfo.userId) {
    // 	return res.sendStatus(HTTP_STATUS.FORBIDEN_403);
    //   }

    const updateComment: boolean =
      await this.commentService.updateCommentByCommentId(
        commentId,
        imputDataModel.content,
      );
  }

  @Delete(':id')
  async deleteCommentByCommentId(@Param('id') commentId: string) {
    const { _id } = req.user;
    const isExistComment = await this.commentQueryRepository.findCommentById(
      commentId,
      _id,
    );
    //   if (!isExistComment) {
    // 	return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    //   }
    //   if (req.user._id.toString() !== isExistComment.commentatorInfo.userId) {
    // 	return res.sendStatus(HTTP_STATUS.FORBIDEN_403);
    //   }
    const deleteCommentById: boolean =
      await this.commentRepository.deleteComment(commentId);
    //   if (!deleteCommentById) {
    // 	return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    //   } else {
    // 	return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    //   }
  }

  @Get(':id')
  async getCommentById(@Param('id') id: string) {
    const userId = req.user?.id ?? null;
    const getCommentById: CommentViewModel | null =
      await this.commentQueryRepository.findCommentById(id, userId);
    // if (!getCommentById) {
    //   return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    // }
    // return res.status(HTTP_STATUS.OK_200).send(getCommentById);
  }
}
