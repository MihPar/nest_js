import { findCommentDBToView } from './../../utils/helpers';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CommentsDB } from './comment.class';
import { commentDBToView } from 'src/utils/helpers';
import { Model } from 'mongoose';
import { CommentClass, CommentDocument } from 'src/schema/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LikeClass, LikeDocument } from 'src/schema/likes.schema';
import { CommentViewModel } from './comment.type';
import { LikeStatusEnum } from '../likes/likes.emun';
import { Like } from '../likes/likes.class';

@Injectable()
export class CommentQueryRepository {
	constructor(
		@InjectModel(CommentClass.name) private commentModel: Model<CommentDocument>,
		@InjectModel(LikeClass.name) private likeModel: Model<LikeDocument>
	) {}

	async findCommentById( commentId: string) {
		try {
			const commentById: CommentClass | null = await this.commentModel.findOne({
			  _id: new ObjectId(commentId),
			});
			if (!commentById) {
			  return null;
			}
			// const findLike = await this.findLikeCommentByUser(commentId, new ObjectId("commentatorInfo.userId"))
			const likeStatus = LikeStatusEnum.None
			return commentDBToView(commentById, likeStatus);
		  } catch (e) {
			return null;
		  }
	  }

	//   async findLikeCommentByUser(commentId: string, userId: ObjectId) {
	// 	const likeModel = await this.likeModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})
	// 	return likeModel
	//   }

  async findCommentByPostId(
    postId: string,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
  ) {
    const filter = { postId: postId };
    const commentByPostId: CommentsDB[] = await this.commentModel.find(filter)
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
        const commnent = findCommentDBToView(item, findLike);
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

//   async findCommentByCommentId(commentId: string) {
// 	const commentById: CommentsDB | null = await CommentsModel.findOne({_id: new ObjectId(commentId)});
// 	  return commentById
//   }
}
