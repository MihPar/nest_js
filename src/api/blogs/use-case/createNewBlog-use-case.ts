import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { bodyBlogsModel } from "../blogs.class";
import { BlogsViewType } from "../blogs.type";
import { BlogClass } from "../../../schema/blogs.schema";
import { BlogsRepository } from "../blogs.repository";

export class CreateNewBlogCommand {
	constructor(
		public inputDateModel: bodyBlogsModel
	) {}
}

@CommandHandler(CreateNewBlogCommand)
export class CreateNewBlogUseCase implements ICommandHandler<CreateNewBlogCommand> {
	constructor(
		protected readonly blogsRepository: BlogsRepository
	){}
	async execute(command: CreateNewBlogCommand): Promise<BlogsViewType> {
			const newBlog: BlogClass = new BlogClass (command.inputDateModel.name, command.inputDateModel.description, command.inputDateModel.websiteUrl, true)
			const createBlog: BlogClass = await this.blogsRepository.createNewBlogs(newBlog);
			return createBlog.getBlogViewModel();
	}
}