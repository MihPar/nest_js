import { likeInfoType } from "src/api/likes/likes.type"

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