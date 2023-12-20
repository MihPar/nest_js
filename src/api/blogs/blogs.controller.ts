import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { BlogsQueryRepository } from "./blogs.queryReposity";
import { PaginationType } from "src/types/pagination.types";
import { Blogs } from "./blogs.class";
import { bodyBlogsModel } from "./blogs.type";
import { BlogsService } from "./blogs.service";
import { Posts } from "../posts/posts.class";
import { PostsQueryRepositories } from "../posts/postQuery.repository";
import { bodyPostsModel } from "../posts/posts.type";
import { PostsService } from "../posts/posts.service";
import { ObjectId } from "mongodb";
import { BlogsRepository } from "./blogs.repository";

@Controller("api")
export class BlogsController {
	constructor(
		protected blogsQueryRepository: BlogsQueryRepository,
		protected blogsService: BlogsService,
		protected postsQueryRepositories: PostsQueryRepositories,
		protected postsService: PostsService,
		protected blogsRepository: BlogsRepository
	) {}

	@Get("blogs")
	async getBlogs(@Query() query: {searchNameTerm: string, sortBy: string, sortDirection: string, pageNumber: string, pageSize: string}) {
		const getAllBlogs: PaginationType<Blogs> =
      await this.blogsQueryRepository.findAllBlogs(
        query.searchNameTerm,
        query.pageNumber = "1",
        query.pageSize = "10",
        query.sortBy = "createAt",
        query.sortDirection = "desc"
      );
    // return res.status(HTTP_STATUS.OK_200).send(getAllBlogs);
	}

	@Post("blogs")
	async createBlog(@Body() inputDateModel: bodyBlogsModel) {
		const createBlog: Blogs = await this.blogsService.createNewBlog(
			inputDateModel.name,
			inputDateModel.description,
			inputDateModel.websiteUrl
		  );
		//   return res.status(HTTP_STATUS.CREATED_201).send(createBlog);
	}

	@Get("blogs/blogId/post")
	async getPostsByBlogId(@Param('id') blogId: string, @Query() query: {pageNumber: string, pageSize: string, sortBy: string,sortDirection: string,}) {

		const userId = req.user._id.toString() ?? null;

		const blog = await this.blogsQueryRepository.findBlogById(blogId);
		// if (!blog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
	
		const getPosts: PaginationType<Posts> =
		  await this.postsQueryRepositories.findPostsByBlogsId(
			query.pageNumber = "1",
			query.pageSize = "10",
			query.sortBy = "createAt",
			query.sortDirection = "desc",
			blogId,
			userId
		  );
		// return res.status(HTTP_STATUS.OK_200).send(getPosts);
	  }

	  @Post("blogs/blogId/post")
	  async createPostByBlogId(@Param("id") blogId: string, @Body() inputDataModel: bodyPostsModel) {
	
		const blog: Blogs = await this.blogsQueryRepository.findBlogById(blogId);
		// if (!blog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
	
		const isCreatePost = await this.postsService.createPost(
		  blogId,
		  inputDataModel.title,
		  inputDataModel.shortDescription,
		  inputDataModel.content,
		  blog.name
		);
		// if (!isCreatePost) {
		//   return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		// } else {
		//   return res.status(HTTP_STATUS.CREATED_201).send(isCreatePost);
		// }
	  }

	  @Get("blogs/:id")
	  async getBlogsById(@Param("id") _id: string) {
		const blogById: Blogs | null = await this.blogsQueryRepository.findBlogById(_id);
		// if (!blogById) {
		//   return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		// } else {
		//   return res.status(HTTP_STATUS.OK_200).send(blogById);
		// }
	  }

	  @Put("blogs/:id")
	  async updateBlogsById(@Param("id") id: string, @Body() inputDateMode: bodyBlogsModel) {
		const isUpdateBlog: boolean = await this.blogsService.updateBlog(
		  id,
		  inputDateMode.name,
		  inputDateMode.description,
		  inputDateMode.websiteUrl
		);
		// if (!isUpdateBlog) {
		//   return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		// } else {
		//   return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
		// }
	  }

	  @Delete("blogs/:id")
	  async deleteBlogsById(@Param("id") id: string) {
		const isDeleted: boolean = await this.blogsRepository.deletedBlog(id)
		//   if (!isDeleted) {
		// 	return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		//   } 
		// 	return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
		// }
	  }

}