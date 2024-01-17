import { CommentViewModel } from "../api/comment/comment.type";
import { LikeStatusEnum } from "../api/likes/likes.emun";
import { CommentClass } from "../schema/comment.schema";

export const commentDBToView = (item: CommentClass, myStatus: LikeStatusEnum | null): CommentViewModel => {
	return {
	  id: item._id!.toString(),
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