import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserClass } from "../../../schema/user.schema";
import { InputModelLikeStatusClass } from "../../comment/comment.class";
import { InputModelClassPostId } from "../posts.class";
import { LikesRepository } from "../../likes/likes.repository";
import { ObjectId } from "mongodb";
import { PostsRepository } from "../posts.repository";

export class UpdateLikeStatus {
	constructor(
		public status: InputModelLikeStatusClass,
		public dto: InputModelClassPostId, 
		public userId: string | null,
		public user: UserClass,
	) {}
}

@CommandHandler(UpdateLikeStatus)
export class UpdateLikeStatusCase implements ICommandHandler<UpdateLikeStatus> {
	constructor(
		protected readonly likesRepository: LikesRepository,
		protected readonly postsRepository: PostsRepository
	) {}
	async execute(command: UpdateLikeStatus): Promise<boolean | void | null> {
		const userLogin = command.user.accountData.userName;
		if(!command.userId) return null
		const userId = new ObjectId(command.userId)
		const findLike = await this.likesRepository.findLikePostByUser(command.dto.postId, userId)
	if(!findLike) {
		await this.likesRepository.saveLikeForPost(command.dto.postId, userId, command.status.likeStatus, userLogin)
		const resultCheckListOrDislike = await this.postsRepository.increase(command.dto.postId, command.status.likeStatus)
		return true
	} 
	
	if((findLike.myStatus === 'Dislike' || findLike.myStatus === 'Like') && command.status.likeStatus === 'None'){
		await this.likesRepository.updateLikeStatusForPost(command.dto.postId, userId, command.status.likeStatus)
		const resultCheckListOrDislike = await this.postsRepository.decrease(command.dto.postId, findLike.myStatus)
		return true
	}

	if(findLike.myStatus === 'None' && (command.status.likeStatus === 'Dislike' || command.status.likeStatus === 'Like')) {
		await this.likesRepository.updateLikeStatusForPost(command.dto.postId, userId, command.status.likeStatus)
		const resultCheckListOrDislike = await this.postsRepository.increase(command.dto.postId, command.status.likeStatus)
		return true
	}

	if(findLike.myStatus === 'Dislike' && command.status.likeStatus === 'Like') {
		await this.likesRepository.updateLikeStatusForPost(command.dto.postId, userId, command.status.likeStatus)
		const changeDislikeOnLike = await this.postsRepository.increase(command.dto.postId, command.status.likeStatus)
		const changeLikeOnDislike = await this.postsRepository.decrease(command.dto.postId, findLike.myStatus)
		return true
	}
	if(findLike.myStatus === 'Like' && command.status.likeStatus === 'Dislike') {
		await this.likesRepository.updateLikeStatusForPost(command.dto.postId, userId, command.status.likeStatus)
		const changeLikeOnDislike = await this.postsRepository.decrease(command.dto.postId, findLike.myStatus)
		const changeDislikeOnLike = await this.postsRepository.increase(command.dto.postId, command.status.likeStatus)
		return true
	}
	return true
	}
}


	