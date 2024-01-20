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
	async execute(command: CreateNewBlogCommand): Promise<BlogsViewType | null> {
			const newBlog: BlogClass = new BlogClass (command.inputDateModel.name, command.inputDateModel.description, command.inputDateModel.websiteUrl, false)
			const createBlog: BlogClass | null = await this.blogsRepository.createNewBlogs(newBlog);
			if(!createBlog) return null
			return createBlog.getBlogViewModel();
	}
}