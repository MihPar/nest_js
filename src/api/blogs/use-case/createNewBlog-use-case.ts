import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { bodyBlogsModel } from "../blogs.class";
import { BlogsViewType } from "../blogs.type";
import { BlogClass } from "../../../schema/blogs.schema";
import { BlogsRepository } from "../blogs.repository";

export class CreateNewBlog {
	constructor(
		public inputDateModel: bodyBlogsModel
	) {}
}

@CommandHandler(CreateNewBlog)
export class CreateNewBlogCase implements ICommandHandler<CreateNewBlog> {
	constructor(
		protected readonly blogsRepository: BlogsRepository
	){}
	async execute(command: CreateNewBlog): Promise<BlogsViewType> {
			const newBlog: BlogClass = new BlogClass (command.inputDateModel.name, command.inputDateModel.description, command.inputDateModel.websiteUrl, false)
			const createBlog: BlogClass = await this.blogsRepository.createNewBlogs(newBlog);
			return createBlog.getBlogViewModel();
	}
}