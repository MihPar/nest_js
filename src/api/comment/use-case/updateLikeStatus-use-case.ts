import { ObjectId } from "mongodb";
import { InputModelLikeStatusClass, inputModelCommentId } from "../comment.class";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikesRepository } from "api/likes/likes.repository";
import { CommentRepository } from "../comment.repository";

export class UpdateLikestatus {
	constructor(
		public status: InputModelLikeStatusClass,
		public id: inputModelCommentId,
		public userId: ObjectId
	) {}
}

@CommandHandler(UpdateLikestatus)
export class UpdateLikestatusCase implements ICommandHandler<UpdateLikestatus> {
	constructor(
		protected readonly likesRepository: LikesRepository,
		protected readonly commentRepositoriy: CommentRepository

	) {}
	async execute(command: UpdateLikestatus): Promise<boolean> {
		const findLike = await this.likesRepository.findLikeCommentByUser(command.id.commentId, new ObjectId(command.userId))
	if(!findLike) {
		await this.likesRepository.saveLikeForComment(command.id.commentId, new ObjectId(command.userId), command.status.likeStatus)
		const resultCheckListOrDislike = await this.commentRepositoriy.increase(command.id.commentId, command.status.likeStatus)
		return true
	} 
	
	if((findLike.myStatus === 'Dislike' || findLike.myStatus === 'Like') && command.status.likeStatus === 'None'){
		await this.likesRepository.updateLikeStatusForComment(command.id.commentId, new ObjectId(command.userId), command.status.likeStatus)
		const resultCheckListOrDislike = await this.commentRepositoriy.decrease(command.id.commentId, findLike.myStatus)
		return true
	}

	if(findLike.myStatus === 'None' && (command.status.likeStatus === 'Dislike' || command.status.likeStatus === 'Like')) {
		await this.likesRepository.updateLikeStatusForComment(command.id.commentId, new ObjectId(command.userId), command.status.likeStatus)
		const resultCheckListOrDislike = await this.commentRepositoriy.increase(command.id.commentId, command.status.likeStatus)
		return true
	}

	if(findLike.myStatus === 'Dislike' && command.status.likeStatus === 'Like') {
		await this.likesRepository.updateLikeStatusForComment(command.id.commentId, new ObjectId(command.userId), command.status.likeStatus)
		const changeDislikeOnLike = await this.commentRepositoriy.increase(command.id.commentId, command.status.likeStatus)
		const changeLikeOnDislike = await this.commentRepositoriy.decrease(command.id.commentId, findLike.myStatus)
		return true
	}
	if(findLike.myStatus === 'Like' && command.status.likeStatus === 'Dislike') {
		await this.likesRepository.updateLikeStatusForComment(command.id.commentId, new ObjectId(command.userId), command.status.likeStatus)
		const changeLikeOnDislike = await this.commentRepositoriy.decrease(command.id.commentId, findLike.myStatus)
		const changeDislikeOnLike = await this.commentRepositoriy.increase(command.id.commentId, command.status.likeStatus)
		return true
	}
	return false
	}
}
