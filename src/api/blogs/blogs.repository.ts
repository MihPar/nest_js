import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { BlogClass, BlogDocument } from "../../schema/blogs.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BlogsDB } from "./blogs.class";

@Injectable()
export class BlogsRepository {
	constructor(
		@InjectModel(BlogClass.name) private blogModel: Model<BlogDocument>
	) {}
  async deleteRepoBlogs() {
    const deletedAll = await this.blogModel.deleteMany({});
    return deletedAll.deletedCount === 1;
  }

  async createNewBlogs(newBlog: BlogsDB): Promise<BlogsDB> {
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
	console.log(result)
    // return result
  }

  async deletedBlog(id: string) {
    const result = await this.blogModel.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}