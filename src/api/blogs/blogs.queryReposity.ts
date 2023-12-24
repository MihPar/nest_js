import { Injectable } from "@nestjs/common";
import { Blogs, BlogsDB } from "./blogs.class";
import { PaginationType } from "src/types/pagination.types";
import { ObjectId } from "mongodb";
import { BlogClass, BlogDocument } from "src/schema/blogs.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { BlogsViewType } from "./blogs.type";

@Injectable()
export class BlogsQueryRepository {
	constructor(
			@InjectModel(BlogClass.name) private blogModel: Model<BlogDocument>
		) {}

	async findAllBlogs(searchNameTerm: string | null, sortBy: string, sortDirection: string, pageNumber: string, pageSize: string) {
		const filtered = searchNameTerm
		  ? { name: { $regex: searchNameTerm ?? '', $options: 'i' } }
		  : {}
		const blogs: BlogsViewType[] = await this.blogModel.find()
		  .find(filtered, { __v: 0 } )
		  .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
		  .skip((+pageNumber - 1) * +pageSize)
		  .limit(+pageSize)
		  .lean();
	
		const totalCount: number = await this.blogModel.countDocuments(filtered);
		const pagesCount: number = Math.ceil(totalCount / +pageSize);
		
		const result: PaginationType<BlogsViewType> = {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: totalCount,
			items: blogs,
		}
		return result
	
	}
	async findBlogById(id: string, userId?: string): Promise<BlogsViewType | null> {
		return await this.blogModel.findOne({ _id: new ObjectId(id) }, {__v: 0})
		// return blog ? BlogsDB.getBlogsViewModel(blog) : null;
	  }
}