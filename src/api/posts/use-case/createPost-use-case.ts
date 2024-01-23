import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { inputModelPostClass } from "../posts.class";
import { PostsViewModel } from "../posts.type";
import { PostClass } from "../../../schema/post.schema";
import { PostsRepository } from "../posts.repository";
import { LikesRepository } from "../../likes/likes.repository";

export class CreatePostCommand {
	constructor(
		public inputModelPost: inputModelPostClass,
		public blogName: string
	) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
	constructor(
		protected readonly postsRepository: PostsRepository,
		protected readonly likesRepository: LikesRepository
		
	) {}
	async execute(command: CreatePostCommand): Promise<PostsViewModel | null> {
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
			if(!post) return null
			const result = await this.likesRepository.getNewLike(post._id.toString(), command.inputModelPost.blogId)
			return createPost.getPostViewModel(result.myStatus, result.newestLikes);
	}
}