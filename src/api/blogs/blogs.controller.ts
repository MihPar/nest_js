import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query } from "@nestjs/common";
import { BlogsQueryRepository } from "./blogs.queryReposity";
import { PaginationType } from "src/types/pagination.types";
import { Blogs } from "./blogs.class";
import { BlogsViewType, bodyBlogsModel } from "./blogs.type";
import { BlogsService } from "./blogs.service";
import { Posts } from "../posts/posts.class";
import { bodyPostsModel } from "../posts/posts.type";
import { PostsService } from "../posts/posts.service";
import { BlogsRepository } from "./blogs.repository";
import { PostsQueryRepository } from "../posts/postQuery.repository";

@Controller("blogs")
export class BlogsController {
	constructor(
		protected blogsQueryRepository: BlogsQueryRepository,
		protected blogsService: BlogsService,
		protected postsQueryRepository: PostsQueryRepository,
		protected postsService: PostsService,
		protected blogsRepository: BlogsRepository
	) {}

	@Get()
	async getBlogsWithPagin(@Query() query: {searchNameTerm: string, sortBy: string, sortDirection: string, pageNumber: string, pageSize: string}) {
		const getAllBlogs: PaginationType<BlogsViewType> =
      await this.blogsQueryRepository.findAllBlogs(
        query.searchNameTerm,
        query.pageNumber = "1",
        query.pageSize = "10",
        query.sortBy = "createAt",
        query.sortDirection = "desc"
      );
	}

	@Post()
	async createBlog(@Body() inputDateModel: bodyBlogsModel) {
		const createBlog: Blogs = await this.blogsService.createNewBlog(inputDateModel)
		return createBlog
	}

	@Get(":blogId/post")
	async getPostsByBlogId(@Param('blogId') blogId: string, @Query() query: {pageNumber: string, pageSize: string, sortBy: string,sortDirection: string,}) {
		const blog = await this.blogsQueryRepository.findBlogById(blogId);
		if (!blog) throw new NotFoundException("Blogs by id not found")
		const getPosts: PaginationType<Posts> =
		  await this.postsQueryRepository.findPostsByBlogsId(
			query.pageNumber = "1",
			query.pageSize = "10",
			query.sortBy = "createAt",
			query.sortDirection = "desc",
			blogId,
		  );
		  if(!getPosts) throw new NotFoundException("Blogs by id not found")
		  return getPosts
	  }

	  @Post(":blogId/post")
	  async createPostByBlogId(@Param("blogId") blogId: string, @Body() inputDataModel: bodyPostsModel) {
		const findBlog: Blogs = await this.blogsQueryRepository.findBlogById(blogId);
		if (!findBlog) throw new NotFoundException("Blogs by id not found")
		const isCreatePost = await this.postsService.createPost(
		  blogId, inputDataModel, findBlog.name
		);
		if(!isCreatePost) throw new NotFoundException("Blogs by id not found")
		return isCreatePost
	  }

	  @Get(":id")
	  async getBlogsById(@Param("blogId") _id: string): Promise<BlogsViewType | null> {
		const blogById: BlogsViewType | null = await this.blogsQueryRepository.findBlogById(_id);
		if (!blogById) throw new NotFoundException("Blogs by id not found")
		return blogById
	  }

	  @Put(":id")
	  async updateBlogsById(@Param("blogId") id: string, @Body() inputDateMode: bodyBlogsModel) {
		const isUpdateBlog: boolean = await this.blogsService.updateBlog(
		  id,
		  inputDateMode.name,
		  inputDateMode.description,
		  inputDateMode.websiteUrl
		);
		if (!isUpdateBlog) throw new NotFoundException("Blogs by id not found")
	  }

	  @Delete("/:id")
	  async deleteBlogsById(@Param("blogId") id: string) {
		const isDeleted: boolean = await this.blogsRepository.deletedBlog(id)
		  if (!isDeleted) throw new NotFoundException("Blogs by id not found")
		  return true
	  }

}