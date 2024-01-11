import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { BlogClass, BlogDocument } from "../../schema/blogs.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BlogsRepository {
	constructor(
		@InjectModel(BlogClass.name) private blogModel: Model<BlogDocument>
	) {}
  async deleteRepoBlogs() {
    const deletedAll = await this.blogModel.deleteMany({});
    return deletedAll.deletedCount === 1;
  }

  async createNewBlogs(newBlog: BlogClass): Promise<BlogClass> {
    const result = await this.blogModel.create(newBlog);
    return newBlog;
  }

  async updateBlogById(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<BlogClass | any> {
    const result = await this.blogModel.updateOne(
      { _id: id },
      {
        $set: { name: name, description: description, websiteUrl: websiteUrl },
      },
    );
	// console.log("update blog by id str 35: ", result)
    return result.matchedCount === 1
  }

  async deletedBlog(id: string) {
    const result = await this.blogModel.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}