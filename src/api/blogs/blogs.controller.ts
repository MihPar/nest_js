import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query } from "@nestjs/common";
import { BlogsQueryRepository } from "./blogs.queryReposity";

import { Blogs } from "./blogs.class";
import { BlogsViewType, bodyBlogsModel } from "./blogs.type";
import { BlogsService } from "./blogs.service";
import { Posts } from "../posts/posts.class";
import { bodyPostsModel } from "../posts/posts.type";
import { PostsService } from "../posts/posts.service";
import { BlogsRepository } from "./blogs.repository";
import { PostsQueryRepository } from "../posts/postQuery.repository";
import { Users } from "../users/user.class";
import { UserDecorator, UserIdDecorator } from "../../infrastructure/decorator/decorator.user";
import { PaginationType } from "../../types/pagination.types";

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsService: BlogsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected postsService: PostsService,
    protected blogsRepository: BlogsRepository,
  ) {}

  @Get()
  @HttpCode(200)
  async getBlogsWithPagin(
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: string;
      pageSize: string;
    },
  ) {
    const getAllBlogs: PaginationType<Blogs> =
      await this.blogsQueryRepository.findAllBlogs(
        query.searchNameTerm,
        (query.pageNumber = '1'),
        (query.pageSize = '10'),
        (query.sortBy = 'createdAt'),
        (query.sortDirection = 'desc'),
      );
    return getAllBlogs;
  }

  @Post()
  @HttpCode(201)
  async createBlog(@Body() inputDateModel: bodyBlogsModel) {
    const createBlog: Blogs = await this.blogsService.createNewBlog(
      inputDateModel,
    );
    return createBlog;
  }

  @Get(':blogId/posts')
  @HttpCode(200)
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
	@UserDecorator() user: Users,
	@UserIdDecorator() userId: string | null,
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      sortBy: string;
      sortDirection: string;
    },
  ) {
    const blog = await this.blogsQueryRepository.findBlogById(blogId);
	// console.log("find blog by id, str 72: ", blog)
    if (!blog) throw new NotFoundException('Blogs by id not found');
    const getPosts: PaginationType<Posts> =
      await this.postsQueryRepository.findPostsByBlogsId(
        (query.pageNumber = '1'),
        (query.pageSize = '10'),
        (query.sortBy = 'createdAt'),
        (query.sortDirection = 'desc'),
        blogId,
		userId
      );
    if (!getPosts) throw new NotFoundException('Blogs by id not found');
    return getPosts;
  }

  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() inputDataModel: bodyPostsModel,
  ) {
    const findBlog: Blogs = await this.blogsQueryRepository.findBlogById(blogId);
	// console.log("find blog by blogId, str 94: ", findBlog)
    if (!findBlog) throw new NotFoundException('Blogs by id not found');
    const isCreatePost = await this.postsService.createPost(
      blogId,
      inputDataModel.title,
      inputDataModel.shortDescription,
      inputDataModel.content,
      findBlog.name,
    );
    if (!isCreatePost) throw new NotFoundException('Blogs by id not found');
    return isCreatePost;
  }

  @Get(':id')
  @HttpCode(200)
  async getBlogsById(
    @Param('id') id: string,
  ): Promise<BlogsViewType | null> {
    const blogById: BlogsViewType | null =
      await this.blogsQueryRepository.findBlogById(id);
    if (!blogById) throw new NotFoundException('Blogs by id not found');
    return blogById;
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlogsById(
    @Param('id') id: string,
    @Body() inputDateMode: bodyBlogsModel,
  ) {
    const isUpdateBlog: boolean = await this.blogsService.updateBlog(
      id,
      inputDateMode.name,
      inputDateMode.description,
      inputDateMode.websiteUrl,
    );
    if (!isUpdateBlog) throw new NotFoundException('Blogs by id not found');
	return isUpdateBlog
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteBlogsById(@Param('id') id: string) {
    const isDeleted: boolean = await this.blogsRepository.deletedBlog(id);
    if (!isDeleted) throw new NotFoundException('Blogs by id not found');
    return isDeleted;
  }
}