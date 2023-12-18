import { BlogsRepository } from "./blogs.repository";

export class BlogsService {
	constructor(
		protected blogsRepository: BlogsRepository
	) {}
	async deleteAllBlogs() {
		return await this.blogsRepository.deleteRepoBlogs();
	}
}