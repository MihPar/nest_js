import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../posts.repository";

export class DeletePostById {
	constructor(
		public postId: string
	) {}
}

@CommandHandler(DeletePostById)
export class DeletePostByIdCase implements ICommandHandler<DeletePostById> {
	constructor(
		protected readonly postsRepository: PostsRepository
	) {}
	async execute(command: DeletePostById): Promise<boolean> {
		return await this.postsRepository.deletedPostById(command.postId);
	}
}