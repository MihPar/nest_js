import { ObjectId } from "mongodb";
import { BlogsDB } from "./blogs.class";
import { BlogsRepository } from "./blogs.repository";

export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async deleteAllBlogs() {
    return await this.blogsRepository.deleteRepoBlogs();
  }

  async createNewBlog(name: string, description: string, websiteUrl: string) {
    const newBlog: BlogsDB = new BlogsDB(name, description, websiteUrl, true);
    const createBlog: BlogsDB = await this.blogsRepository.createNewBlogs(
      newBlog,
    );
    return createBlog.getBlogViewModel();
  }

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    return await this.blogsRepository.updateBlogById(id, name, description, websiteUrl
    );
  }
}