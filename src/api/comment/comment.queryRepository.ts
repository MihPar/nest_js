import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CommentsDB } from './comment.class';
import { commentDBToView } from '../../utils/helpers';
import { Model } from 'mongoose';
import { CommentClass, CommentDocument } from '../../schema/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LikeClass, LikeDocument } from '../../schema/likes.schema';
import { CommentViewModel } from './comment.type';
import { Like } from '../likes/likes.class';
import { PaginationType } from '../../types/pagination.types';

@Injectable()
export class CommentQueryRepository {
  constructor(
    @InjectModel(CommentClass.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(LikeClass.name) private likeModel: Model<LikeDocument>,
  ) {}

  async findCommentById(
    commentId: string,
    userId: string,
  ): Promise<CommentViewModel | null> {
	console.log(userId)
    try {
      const commentById: CommentsDB | null = await this.commentModel.findOne({
        _id: new ObjectId(commentId),
      });
      if (!commentById) {
        return null;
      }
      const findLike: Like | null = await this.findLikeCommentByUser(
        commentId,
        new ObjectId(userId),
      );
      return commentDBToView(commentById, findLike?.myStatus ?? null);
    } catch (e) {
      return null;
    }
  }

  async findLikeCommentByUser(commentId: string, userId: ObjectId) {
    const likeModel: Like | null = await this.likeModel.findOne({
      $and: [{ userId: userId }, { commentId: commentId }],
    });
    return likeModel;
  }

  async findCommentByPostId(
    postId: string,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    userId: string,
  ): Promise<PaginationType<CommentViewModel> | null> {
    const filter = { postId: postId };
    const commentByPostId: CommentsDB[] = await this.commentModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();
    const totalCount: number = await this.commentModel.countDocuments(filter);
    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    let findLike;
    let status: Like | null;
    const items: CommentViewModel[] = await Promise.all(
      commentByPostId.map(async (item) => {
        findLike = null;
        if (userId) {
          status = await this.likeModel.findOne({
            userId,
            commentId: item._id.toString(),
          });
          findLike = status ? status.myStatus : null;
        }

        const commnent = commentDBToView(item, findLike);
        return commnent;
      }),
    );
    return {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items,
    };
  }
}
