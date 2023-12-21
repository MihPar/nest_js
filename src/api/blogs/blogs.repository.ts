import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { BlogClass, BlogDocument } from "src/schema/blogs.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BlogsViewType } from "./blogs.type";

@Injectable()
export class BlogsRepository {
	constructor(
		@InjectModel(BlogClass.name) private blogModel: Model<BlogDocument>
	) {}
  async deleteRepoBlogs() {
    const deletedAll = this.blogModel.deleteMany({});
    // return deletedAll.deletedCount === 1;
    return deletedAll.deleteMany()
  }

  async createNewBlogs(newBlog: BlogsViewType): Promise<BlogsViewType> {
    const result = await this.blogModel.create(newBlog);
    return newBlog;
  }

  async updateBlogById(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<BlogClass | any> {
    const result = this.blogModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { name: name, description: description, websiteUrl: websiteUrl },
      },
    );
    return result.updateOne()
  }

  async deletedBlog(id: string) {
    const result = this.blogModel.deleteOne({ _id: new ObjectId(id) });
    // return result.deletedCount === 1;
    return result.deleteOne()
  }
}