import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../posts.repository";

export class DeleteAllPosts {
	constructor() {}
}

@CommandHandler(DeleteAllPosts)
export class DeleteAllPostsCase implements ICommandHandler<DeleteAllPosts> {
	constructor(
		protected readonly postsRepository: PostsRepository
	) {}
 	async execute(command: DeleteAllPosts): Promise<any> {
			return await this.postsRepository.deleteRepoPosts();
	}
}