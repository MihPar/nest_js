import { Injectable } from "@nestjs/common"
import { PostsDB } from "./posts.class";
import { PostsRepository } from "./posts.repository";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PostsViewModel } from "./posts.type";
import { LikeClass, LikeDocument } from "../../schema/likes.schema";
import { PostClass, PostDocument } from "../../schema/post.schema";
import { LikeStatusEnum } from "../likes/likes.emun";
import { ObjectId } from "mongodb";
import { LikesRepository } from "../likes/likes.repository";




@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostClass.name) private postModel: Model<PostDocument>,
    @InjectModel(LikeClass.name) private likeModel: Model<LikeDocument>,
    protected postsRepository: PostsRepository,
    protected likesRepository: LikesRepository,
  ) {}

//   async createPost(
//     blogId: string,
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogName: string,
//   ): Promise<PostsViewModel | null> {
//     const newPost: PostsDB = new PostsDB(
//       title,
//       shortDescription,
//       content,
//       blogId,
//       blogName,
//     );
// 	// console.log(newPost)
//     const createPost: PostsDB = await this.postsRepository.createNewPosts(newPost);
// 	// console.log(createPost)
//     const post = await this.postModel
//       .findOne({ blogId: new ObjectId(blogId) }, { __v: 0 }) //
//       .lean();
// 	if(!post) return null
//     const newestLikes = await this.likeModel
//       .find({ postId: post._id }) //
//       .sort({ addedAt: -1 })
//       .limit(3)
//       .skip(0)
//       .lean();
//     let myStatus: LikeStatusEnum = LikeStatusEnum.None;
//     if (blogId) {
//       const reaction = await this.likeModel.findOne({ blogId: new ObjectId(blogId) }, { __v: 0 }); //
//       myStatus = reaction
//         ? (reaction.myStatus as unknown as LikeStatusEnum)
//         : LikeStatusEnum.None;
//     }
//     return createPost.getPostViewModel(myStatus, newestLikes);
//   }

  async updateOldPost(
	id: string,
	title: string,
	shortDescription: string,
	content: string,
	blogId: string
  ): Promise<boolean> {
	const updatPostById: boolean = await this.postsRepository.updatePost(
	  id,
	  title,
	  shortDescription,
	  content,
	  blogId
	);
	return updatPostById;
  }

  async deletePostId(id: string): Promise<boolean> {
	return await this.postsRepository.deletedPostById(id);
  }

//   async deleteAllPosts() {
//   	return await this.postsRepository.deleteRepoPosts();
//   }

//   async updateLikeStatus(likeStatus: string, postId: string, userId: ObjectId, userLogin: string): Promise<boolean | void> {
// 	const findLike = await this.likesRepository.findLikePostByUser(postId, userId)
// 	if(!findLike) {
// 		await this.likesRepository.saveLikeForPost(postId, userId, likeStatus, userLogin)
// 		const resultCheckListOrDislike = await this.postsRepository.increase(postId, likeStatus)
// 		return true
// 	} 
	
// 	if((findLike.myStatus === 'Dislike' || findLike.myStatus === 'Like') && likeStatus === 'None'){
// 		await this.likesRepository.updateLikeStatusForPost(postId, userId, likeStatus)
// 		const resultCheckListOrDislike = await this.postsRepository.decrease(postId, findLike.myStatus)
// 		return true
// 	}

// 	if(findLike.myStatus === 'None' && (likeStatus === 'Dislike' || likeStatus === 'Like')) {
// 		await this.likesRepository.updateLikeStatusForPost(postId, userId, likeStatus)
// 		const resultCheckListOrDislike = await this.postsRepository.increase(postId, likeStatus)
// 		return true
// 	}

// 	if(findLike.myStatus === 'Dislike' && likeStatus === 'Like') {
// 		await this.likesRepository.updateLikeStatusForPost(postId, userId, likeStatus)
// 		const changeDislikeOnLike = await this.postsRepository.increase(postId, likeStatus)
// 		const changeLikeOnDislike = await this.postsRepository.decrease(postId, findLike.myStatus)
// 		return true
// 	}
// 	if(findLike.myStatus === 'Like' && likeStatus === 'Dislike') {
// 		await this.likesRepository.updateLikeStatusForPost(postId, userId, likeStatus)
// 		const changeLikeOnDislike = await this.postsRepository.decrease(postId, findLike.myStatus)
// 		const changeDislikeOnLike = await this.postsRepository.increase(postId, likeStatus)
// 		return true
// 	}
// 	return true
// }
}