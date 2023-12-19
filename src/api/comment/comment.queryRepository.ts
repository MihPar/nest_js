import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Like } from 'src/api/likes/likes.class';
import { CommentViewModel } from './comment.type';
import { CommentsDB } from './comment.class';
import { CommentsModel, LikesModel } from 'src/db/db';
import { commentDBToView } from 'src/utils/helpers';

@Injectable()
export class CommentQueryRepository {
  async findCommentByPostId(
    postId: string,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    userId: ObjectId,
  ) {
    const filter = { postId: postId };
    const commentByPostId: CommentsDB[] = await CommentsModel.find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();
    const totalCount: number = await CommentsModel.countDocuments(filter);
    const pagesCount: number = Math.ceil(totalCount / +pageSize);
    let findLike;
    let status: Like | null;
    const items: CommentViewModel[] = await Promise.all(
      commentByPostId.map(async (item) => {
        findLike = null;
        if (userId) {
          status = await LikesModel.findOne({
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

  async findCommentByCommentId(commentId: string) {
	const commentById: CommentsDB | null = await CommentsModel.findOne({_id: new ObjectId(commentId)});
	  return commentById
  }

  async findLikeCommentByUser(commentId: string, userId: ObjectId) {
	const likeModel = LikesModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})
	return likeModel
  }

  async findCommentById( commentId: string, userId: string) {
	try {
		const commentById: CommentsDB | null = await CommentsModel.findOne({
		  _id: new ObjectId(commentId),
		});
		if (!commentById) {
		  return null;
		}
		const findLike = await this.findLikeCommentByUser(commentId, new ObjectId(userId))
		return commentDBToView(commentById, findLike?.myStatus ?? null);
	  } catch (e) {
		return null;
	  }
  }
}
