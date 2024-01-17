import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { inputModelPostClass } from "../posts.class";
import { PostsRepository } from "../posts.repository";

export class UpdateOldPost {
	constructor(
		public postId: string,
    	public inputModelData: inputModelPostClass,
	) {}
}

@CommandHandler(UpdateOldPost)
export class UpdateOldPostCase implements ICommandHandler<UpdateOldPost> {
	constructor(
		protected readonly postsRepository: PostsRepository
	) {}
	async execute(command: UpdateOldPost): Promise<boolean> {
			const updatPostById: boolean = await this.postsRepository.updatePost(
				command.postId,
				command.inputModelData.title,
				command.inputModelData.shortDescription,
				command.inputModelData.content,
				command.inputModelData.blogId
			);
			return updatPostById;
	}
}