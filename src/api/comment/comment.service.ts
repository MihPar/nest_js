import { likesRepository } from './../likes/likes.repository';
import { LikeStatusEnum } from "src/api/likes/likes.emun";
import { CommentsDB } from "./comment.class";
import { CommentRepository } from "./comment.repository";
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class CommentService {
  constructor(
	protected commentRepositories: CommentRepository,
	protected likesRepositories: likesRepository
	) {}
  async createNewCommentByPostId(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ) {
    const newComment: CommentsDB = new CommentsDB(content, postId, {
      userId,
      userLogin,
    });
    const createNewCommentawait: CommentsDB =
      await this.commentRepositories.createNewCommentPostId(newComment);
    return createNewCommentawait.getNewComment(LikeStatusEnum.None);
  }

  async deleteAllComments() {
	return await this.commentRepositories.deleteAllComments();
  }
  async updateLikeStatus(likeStatus: string, commentId: string, userId: ObjectId) {
	const findLike = await this.likesRepositories.findLikeCommentByUser(commentId, new ObjectId(userId))
	if(!findLike) {
		await this.likesRepositories.saveLikeForComment(commentId, new ObjectId(userId), likeStatus)
		const resultCheckListOrDislike = await this.commentRepositories.increase(commentId, likeStatus)
		return true
	} 
	
	if((findLike.myStatus === 'Dislike' || findLike.myStatus === 'Like') && likeStatus === 'None'){
		await this.likesRepositories.updateLikeStatusForComment(commentId, new ObjectId(userId), likeStatus)
		const resultCheckListOrDislike = await this.commentRepositories.decrease(commentId, findLike.myStatus)
		return true
	}

	if(findLike.myStatus === 'None' && (likeStatus === 'Dislike' || likeStatus === 'Like')) {
		await this.likesRepositories.updateLikeStatusForComment(commentId, new ObjectId(userId), likeStatus)
		const resultCheckListOrDislike = await this.commentRepositories.increase(commentId, likeStatus)
		return true
	}

	if(findLike.myStatus === 'Dislike' && likeStatus === 'Like') {
		await this.likesRepositories.updateLikeStatusForComment(commentId, new ObjectId(userId), likeStatus)
		const changeDislikeOnLike = await this.commentRepositories.increase(commentId, likeStatus)
		const changeLikeOnDislike = await this.commentRepositories.decrease(commentId, findLike.myStatus)
		return true
	}
	if(findLike.myStatus === 'Like' && likeStatus === 'Dislike') {
		await this.likesRepositories.updateLikeStatusForComment(commentId, new ObjectId(userId), likeStatus)
		const changeLikeOnDislike = await this.commentRepositories.decrease(commentId, findLike.myStatus)
		const changeDislikeOnLike = await this.commentRepositories.increase(commentId, likeStatus)
		return true
	}
	return 
}
  
async updateCommentByCommentId(commentId: string, content: string){
	const updateCommentId = await this.commentRepositories.updateComment(
		commentId,
		content
	  );
	  return updateCommentId;
}
}