import { CommentsDB } from "src/api/comment/comment.class";
import { CommentViewModel } from "src/api/comment/comment.type";
import { LikeStatusEnum } from "src/api/likes/likes.emun";

export const commentDBToView = (item: CommentsDB, myStatus: LikeStatusEnum | null): CommentViewModel => {
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