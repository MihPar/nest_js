import { Injectable } from "@nestjs/common";
import { BlogsModel } from "src/db/db";
import { BlogsDB } from "./blogs.class";
import { ObjectId } from "mongodb";
import { BlogsService } from "./blogs.service";

@Injectable()
export class BlogsRepository {
  async deleteRepoBlogs() {
    const deletedAll = await BlogsModel.deleteMany({});
    return deletedAll.deletedCount === 1;
  }

  async createNewBlogs(newBlog: BlogsDB): Promise<BlogsDB> {
    const result = await BlogsModel.create(newBlog);
    return newBlog;
  }

  async updateBlogById(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const result = await BlogsModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { name: name, description: description, websiteUrl: websiteUrl },
      },
    );
    return result.modifiedCount === 1;
  }

  async deletedBlog(id: string) {
    const result = await BlogsModel.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}