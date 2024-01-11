import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, UseFilters, UseGuards } from "@nestjs/common";
import { BlogsQueryRepository } from "./blogs.queryReposity";
import { bodyBlogsModel } from "./blogs.class";
import { BlogsViewType } from "./blogs.type";
import { BlogsService } from "./blogs.service";
import { Posts, bodyPostsModelClass } from "../posts/posts.class";
import { PostsService } from "../posts/posts.service";
import { BlogsRepository } from "./blogs.repository";
import { PostsQueryRepository } from "../posts/postQuery.repository";
import { UserDecorator, UserIdDecorator } from "../../infrastructure/decorator/decorator.user";
import { PaginationType } from "../../types/pagination.types";
import { AuthBasic } from "../../infrastructure/guards/auth/basic.auth";
import { HttpExceptionFilter } from "../../exceptionFilters.ts/exceptionFilter";
import { UserClass } from "../../schema/user.schema";

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
    const getAllBlogs: PaginationType<BlogsViewType> =
      await this.blogsQueryRepository.findAllBlogs(
        query.searchNameTerm,
		(query.sortBy || 'createdAt'),
		(query.sortDirection || 'desc'),
        (query.pageNumber || '1'),
        (query.pageSize || '10'),
      );
    return getAllBlogs;
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthBasic)
  @UseFilters(new HttpExceptionFilter())
  async createBlog(@Body() inputDateModel: bodyBlogsModel) {
    const createBlog: BlogsViewType = await this.blogsService.createNewBlog(
      inputDateModel,
    );
    return createBlog;
  }
  
  @HttpCode(200)
  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
	@UserDecorator() user: UserClass,
	@UserIdDecorator() userId: string | null,
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      sortBy: string;
      sortDirection: string;
    },
  ) {
	if(!userId) return null
    const blog = await this.blogsQueryRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException('Blogs by id not found');
    const getPosts: PaginationType<Posts> =
      await this.postsQueryRepository.findPostsByBlogsId(
        query.pageNumber || '1',
        query.pageSize || '10',
        query.sortBy || 'createdAt',
        query.sortDirection || 'desc',
        blogId,
		userId
      );
    if (!getPosts) throw new NotFoundException('Blogs by id not found');
    return getPosts;
  }

  @HttpCode(201)
  @Post(':blogId/posts')
  @UseGuards(AuthBasic)
  @UseFilters(new HttpExceptionFilter())
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() inputDataModel: bodyPostsModelClass,
  ) {
    const findBlog: BlogsViewType | null = await this.blogsQueryRepository.findBlogById(blogId);
    if (!findBlog) throw new NotFoundException('Blogs by id not found 404');
    const isCreatePost = await this.postsService.createPost(
      blogId,
      inputDataModel.title,
      inputDataModel.shortDescription,
      inputDataModel.content,
      findBlog.name,
    );
    if (!isCreatePost) throw new NotFoundException('Blogs by id not found 404');
    return isCreatePost;
  }

  @Get(':id')
  @HttpCode(200)
  async getBlogsById(
    @Param('id') id: string,
  ): Promise<BlogsViewType | null> {
    const blogById: BlogsViewType | null =
      await this.blogsQueryRepository.findBlogById(id);
    if (!blogById) throw new NotFoundException('Blogs by id not found 404');
    return blogById;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(AuthBasic)
  @UseFilters(new HttpExceptionFilter())
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
    if (!isUpdateBlog) throw new NotFoundException('Blogs by id not found 404');
	return isUpdateBlog
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthBasic)
  async deleteBlogsById(@Param('id') id: string) {
    const isDeleted: boolean = await this.blogsRepository.deletedBlog(id);
    if (!isDeleted) throw new NotFoundException('Blogs by id not found 404');
    return isDeleted;
  }
}