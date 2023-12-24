import { Blogs, BlogsDB } from './blogs.class';
import { BlogsViewType, bodyBlogsModel } from './blogs.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogClass, BlogDocument } from 'src/schema/blogs.schema';
import { BlogsRepository } from './blogs.repository';

export class BlogsService {
  constructor(
    @InjectModel(BlogClass.name) private blogModel: Model<BlogDocument>,
    protected blogsRepository: BlogsRepository,
  ) {}
  async createNewBlog(inputDateModel: bodyBlogsModel): Promise<BlogsViewType> {
    const newBlog: BlogsDB = new BlogsDB(inputDateModel.name, inputDateModel.description, inputDateModel.websiteUrl, true)
    const createBlog: BlogsDB = await this.blogsRepository.createNewBlogs(newBlog);
    return createBlog.getBlogViewModel();
  }

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    return await this.blogsRepository.updateBlogById(
      id,
      name,
      description,
      websiteUrl,
    );
  }

  async deleteAllBlogs() {
    return await this.blogsRepository.deleteRepoBlogs();
  }
}
