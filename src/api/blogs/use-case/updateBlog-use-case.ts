import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { bodyBlogsModel } from "../blogs.class";
import { BlogsRepository } from "../blogs.repository";

export class UpdateBlog {
	constructor(
		public id: string,
		public inputDateMode: bodyBlogsModel,
	) {}
}

@CommandHandler(UpdateBlog)
export class UpdateBlogCase implements ICommandHandler<UpdateBlog> {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async execute(command: UpdateBlog): Promise<boolean> {
    return await this.blogsRepository.updateBlogById(
      command.id,
      command.inputDateMode.name,
      command.inputDateMode.description,
      command.inputDateMode.websiteUrl,
    );
  }
}