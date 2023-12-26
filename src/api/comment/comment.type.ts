import { likeInfoType } from "../../api/likes/likes.type"

export type CommentViewModel = {
	id: string
	content: string,
	commentatorInfo: CommentatorInfo
	createdAt: string
	likesInfo: likeInfoType
}


export type CommentatorInfo = {
	userId: string;
	userLogin: string;
  };

export type inputModeContentType = {
	content: string
}

export type CommentViewType = {
	id: string
	content: string
	commentatorInfo: {
	  userId: string
	  userLogin: string
	},
	createdAt: string
	likesInfo: {
	  likesCount: number
	  dislikesCount: number
	  myStatus: string
	}
  }