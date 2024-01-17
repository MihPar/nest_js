import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../blogs.repository";

export class DeleteAllBlogs {
	constructor() {}
}

@CommandHandler(DeleteAllBlogs)
export class DeleteAllBlogsCase implements ICommandHandler<DeleteAllBlogs> {
	constructor(
		protected readonly blogsRepository: BlogsRepository
	) {}
 	async execute(command: DeleteAllBlogs): Promise<any> {
		return await this.blogsRepository.deleteRepoBlogs();
	}
}