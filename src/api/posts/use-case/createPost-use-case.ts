import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { inputModelPostClass } from "../posts.class";
import { PostsViewModel } from "../posts.type";
import { PostClass } from "../../../schema/post.schema";
import { PostsRepository } from "../posts.repository";
import { LikesRepository } from "../../likes/likes.repository";

export class CreatePost {
	constructor(
		public inputModelPost: inputModelPostClass,
		public blogName: string
	) {}
}

@CommandHandler(CreatePost)
export class CreatePostCase implements ICommandHandler<CreatePost> {
	constructor(
		protected readonly postsRepository: PostsRepository,
		protected readonly likesRepository: LikesRepository
		
	) {}
	async execute(command: CreatePost): Promise<PostsViewModel | null> {
			const newPost: PostClass = new PostClass(
				command.inputModelPost.title,
				command.inputModelPost.shortDescription,
				command.inputModelPost.content,
				command.inputModelPost.blogId,
				command.blogName,
				0, 0
			);
			const createPost: PostClass | null = await this.postsRepository.createNewPosts(newPost);
			if(!createPost) {
				return null
			}
			const post = await this.postsRepository.findPostById(command.inputModelPost.blogId)
			// const post = await this.postModel
			//   .findOne({ blogId: new ObjectId(blogId) }, { __v: 0 })
			//   .lean();
			if(!post) return null
			const result = await this.likesRepository.getNewLike(post._id.toString(), command.inputModelPost.blogId)
			// const newestLikes = await this.likeModel
			//   .find({ postId: post._id }) //
			//   .sort({ addedAt: -1 })
			//   .limit(3)
			//   .skip(0)
			//   .lean();
			// let myStatus: LikeStatusEnum = LikeStatusEnum.None;
			// if (blogId) {
			//   const reaction = await this.likeModel.findOne({ blogId: new ObjectId(blogId) }, { __v: 0 }); //
			//   myStatus = reaction
			// 	? (reaction.myStatus as unknown as LikeStatusEnum)
			// 	: LikeStatusEnum.None;
			// }
			return createPost.getPostViewModel(result.myStatus, result.newestLikes);
	}
}