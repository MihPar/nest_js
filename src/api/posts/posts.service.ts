import { Injectable } from "@nestjs/common"
import { PostsDB } from "./posts.class";
import { LikesModel, PostsModel } from "src/db/db";
import { PostsRepository } from "./posts.repository";
import { LikeStatusEnum } from "src/api/likes/likes.emun";
import { ObjectId } from "mongodb";
import { likesRepository } from "src/api/likes/likes.repository";

@Injectable()
export class PostsService {
	constructor(
		protected postsRepository: PostsRepository,
		protected likesRepository: likesRepository
	) {}
	async createPost(
		blogId: string,
		title: string,
		shortDescription: string,
		content: string,
		blogName: string) {
			const newPost: PostsDB = new PostsDB(title, shortDescription, content, blogId, blogName)
			// console.log(newPost)
			const createPost: PostsDB = await this.postsRepository.createNewPosts(newPost);
			const post = await PostsModel.findOne({ blogId: blogId }, {__v: 0 }).lean();
			const newestLikes = await LikesModel.find({postId: newPost._id}).sort({addedAt: -1}).limit(3).skip(0).lean()
			let myStatus : LikeStatusEnum = LikeStatusEnum.None;
			if(blogId){
				const reaction = await LikesModel.findOne({blogId: blogId})
				myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None
			}
			return createPost.getPostViewModel(myStatus, newestLikes);
		}
	async updateOldPost(
		id: string,
		title: string,
		shortDescription: string,
		content: string,
		blogId: string) {
			const updatPostById: boolean = await this.postsRepository.updatePost(
				id,
				title,
				shortDescription,
				content,
				blogId
			  );
			  return updatPostById;
	}

	async updateLikeStatus(likeStatus: string, postId: string, userId: ObjectId, userLogin: string) {
		const findLike = await this.likesRepository.findLikePostByUser(postId, userId)
			if(!findLike) {
				await this.likesRepository.saveLikeForPost(postId, userId, likeStatus, userLogin)
				const resultCheckListOrDislike = await this.postsRepository.increase(postId, likeStatus)
				return true
			} 
			
			if((findLike.myStatus === 'Dislike' || findLike.myStatus === 'Like') && likeStatus === 'None'){
				await this.likesRepository.updateLikeStatusForPost(postId, userId, likeStatus)
				const resultCheckListOrDislike = await this.postsRepository.decrease(postId, findLike.myStatus)
				return true
			}
	
			if(findLike.myStatus === 'None' && (likeStatus === 'Dislike' || likeStatus === 'Like')) {
				await this.likesRepository.updateLikeStatusForPost(postId, userId, likeStatus)
				const resultCheckListOrDislike = await this.postsRepository.increase(postId, likeStatus)
				return true
			}
	
			if(findLike.myStatus === 'Dislike' && likeStatus === 'Like') {
				await this.likesRepository.updateLikeStatusForPost(postId, userId, likeStatus)
				const changeDislikeOnLike = await this.postsRepository.increase(postId, likeStatus)
				const changeLikeOnDislike = await this.postsRepository.decrease(postId, findLike.myStatus)
				return true
			}
			if(findLike.myStatus === 'Like' && likeStatus === 'Dislike') {
				await this.likesRepository.updateLikeStatusForPost(postId, userId, likeStatus)
				const changeLikeOnDislike = await this.postsRepository.decrease(postId, findLike.myStatus)
				const changeDislikeOnLike = await this.postsRepository.increase(postId, likeStatus)
				return true
			}
			return true
	}

	async deletePostId(postId: string) {
		return await this.postsRepository.deletedPostById(postId);
	}

	async deleteAllPosts() {
		return await this.postsRepository.deleteRepoPosts();
	}
}