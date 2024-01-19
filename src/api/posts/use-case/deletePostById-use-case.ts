import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../posts.repository";
import { ObjectId } from "mongodb";

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
		if(!ObjectId.isValid(command.postId)) return false;
		return await this.postsRepository.deletedPostById(command.postId);
	}
}