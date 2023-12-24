import { Injectable } from "@nestjs/common"
import { PostsDB } from "./posts.class";
import { PostsRepository } from "./posts.repository";
import { LikeStatusEnum } from "src/api/likes/likes.emun";
import { ObjectId } from "mongodb";
import { likesRepository } from "src/api/likes/likes.repository";
import { PostClass, PostDocument } from "src/schema/post.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { LikeClass, LikeDocument } from "src/schema/likes.schema";
import { PostsViewModel, bodyPostsModel, inputModelPostType } from "./posts.type";

@Injectable()
export class PostsService {
	constructor(
		@InjectModel(PostClass.name) private postModel: Model<PostDocument>,
		@InjectModel(LikeClass.name) private likeModel: Model<LikeDocument>,
		protected postsRepository: PostsRepository,
		protected likesRepository: likesRepository
	) {}
	
	async updateOldPost(
		id: string,
		inputModelData: inputModelPostType) {
			const updatPostById: boolean = await this.postsRepository.updatePost(id, inputModelData)
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

	async createPost(blogId: string, inputModelPost: bodyPostsModel, userName: string
	  ): Promise<PostsViewModel | null> {
		const newPost: PostsDB = new PostsDB(inputModelPost.title, inputModelPost.shortDescription, inputModelPost.content, blogId, userName)
		const createPost = await this.postsRepository.createNewPosts(newPost);
		const post = await this.postModel.findOne({ blogId }, {__v: 0 }).lean();
		const newestLikes = await this.likeModel.find({postId: newPost._id}).sort({addedAt: -1}).limit(3).skip(0).lean()
		let myStatus : LikeStatusEnum = LikeStatusEnum.None;
		// if(blogId){
		// 	const reaction = await this.likeModel.findOne({blogId: blogId})
		// 	myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None
		// }
		return createPost.getPostViewModel(myStatus, newestLikes);
	}

	async deletePostId(postId: string): Promise<boolean> {
		return await this.postsRepository.deletedPostById(postId);
	}

	async deleteAllPosts() {
		return await this.postsRepository.deleteRepoPosts();
	}
}