import { Injectable } from "@nestjs/common";
import { Blogs, BlogsDB } from "./blogs.class";
import { BlogsModel } from "src/db/db";
import { PaginationType } from "src/types/pagination.types";
import { ObjectId } from "mongodb";

@Injectable()
export class BlogsQueryRepository {
	async findAllBlogs(searchNameTerm: string | null, sortBy: string, sortDirection: string, pageNumber: string, pageSize: string) {
		const filtered = searchNameTerm
		  ? { name: { $regex: searchNameTerm ?? '', $options: 'i' } }
		  : {}; // todo finished filter
		const blogs: BlogsDB[] = await BlogsModel
		  .find(filtered, { __v: 0 } )
		  .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
		  .skip((+pageNumber - 1) * +pageSize) //todo find how we can skip
		  .limit(+pageSize)
		  .lean();
	
		const totalCount: number = await BlogsModel.countDocuments(filtered);
		const pagesCount: number = Math.ceil(totalCount / +pageSize);
		
		const result: PaginationType<Blogs> = {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: totalCount,
			items: blogs.map((item) => BlogsDB.getBlogsViewModel(item)),
		}
		return result
	}

	async findBlogById(id: string, userId?: string): Promise<Blogs | null> {
		const blog =  await BlogsModel.findOne({ _id: new ObjectId(id) }, {__v: 0}).lean();
		return blog ? BlogsDB.getBlogsViewModel(blog) : null;
	  }
}