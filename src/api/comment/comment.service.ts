import { ObjectId } from "mongodb";
import { CommentRepository } from "./comment.repository";
import { Injectable } from "@nestjs/common";
import { LikesRepository } from "api/likes/likes.repository";

@Injectable()
export class CommentService {
  constructor(
	protected commentRepositories: CommentRepository,
	protected likesRepository: LikesRepository
	) {}
  async deleteAllComments() {
	return await this.commentRepositories.deleteAllComments();
  }

  async updateLikeStatus(likeStatus: string, commentId: string, userId: ObjectId) {
	const findLike = await this.likesRepository.findLikeCommentByUser(commentId, new ObjectId(userId))
	if(!findLike) {
		await this.likesRepository.saveLikeForComment(commentId, new ObjectId(userId), likeStatus)
		const resultCheckListOrDislike = await this.commentRepositories.increase(commentId, likeStatus)
		return true
	} 
	
	if((findLike.myStatus === 'Dislike' || findLike.myStatus === 'Like') && likeStatus === 'None'){
		await this.likesRepository.updateLikeStatusForComment(commentId, new ObjectId(userId), likeStatus)
		const resultCheckListOrDislike = await this.commentRepositories.decrease(commentId, findLike.myStatus)
		return true
	}

	if(findLike.myStatus === 'None' && (likeStatus === 'Dislike' || likeStatus === 'Like')) {
		await this.likesRepository.updateLikeStatusForComment(commentId, new ObjectId(userId), likeStatus)
		const resultCheckListOrDislike = await this.commentRepositories.increase(commentId, likeStatus)
		return true
	}

	if(findLike.myStatus === 'Dislike' && likeStatus === 'Like') {
		await this.likesRepository.updateLikeStatusForComment(commentId, new ObjectId(userId), likeStatus)
		const changeDislikeOnLike = await this.commentRepositories.increase(commentId, likeStatus)
		const changeLikeOnDislike = await this.commentRepositories.decrease(commentId, findLike.myStatus)
		return true
	}
	if(findLike.myStatus === 'Like' && likeStatus === 'Dislike') {
		await this.likesRepository.updateLikeStatusForComment(commentId, new ObjectId(userId), likeStatus)
		const changeLikeOnDislike = await this.commentRepositories.decrease(commentId, findLike.myStatus)
		const changeDislikeOnLike = await this.commentRepositories.increase(commentId, likeStatus)
		return true
	}
	return 
}

async updateCommentByCommentId(
    commentId: string,
    content: string
  ): Promise<boolean> {
    const updateCommentId = await this.commentRepositories.updateComment(
      commentId,
      content
    );
    return updateCommentId;
  }
}