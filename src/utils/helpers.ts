import { CommentsDB } from "src/api/comment/comment.class";
import { CommentViewModel } from "src/api/comment/comment.type";
import { LikeStatusEnum } from "src/api/likes/likes.emun";
import { CommentClass } from "src/schema/comment.schema";

export const commentDBToView = (item: CommentClass, myStatus: LikeStatusEnum | null): CommentViewModel => {
	return {
	  id: item._id.toString(),
	  content: item.content,
	  commentatorInfo: item.commentatorInfo,
	  createdAt: item.createdAt,
	  likesInfo: {
		likesCount: item?.likesCount || 0,
    	dislikesCount: item?.dislikesCount || 0,
    	myStatus: myStatus || LikeStatusEnum.None
	  }
	};
  };


  export const findCommentDBToView = (item: CommentsDB, myStatus: LikeStatusEnum | null): CommentViewModel => {
	return {
	  id: item._id.toString(),
	  content: item.content,
	  commentatorInfo: item.commentatorInfo,
	  createdAt: item.createdAt,
	  likesInfo: {
		likesCount: item?.likesCount || 0,
    	dislikesCount: item?.dislikesCount || 0,
    	myStatus: myStatus || LikeStatusEnum.None
	  }
	};
  };