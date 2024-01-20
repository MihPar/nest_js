import { CommandBus } from '@nestjs/cqrs';
import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, UseFilters, UseGuards } from "@nestjs/common";
import { BlogsQueryRepository } from "./blogs.queryReposity";
import { bodyBlogsModel, inputModelClass } from "./blogs.class";
import { BlogsViewType } from "./blogs.type";
import { BlogsService } from "./blogs.service";
import { bodyPostsModelClass } from "../posts/posts.class";
import { PostsService } from "../posts/posts.service";
import { BlogsRepository } from "./blogs.repository";
import { PostsQueryRepository } from "../posts/postQuery.repository";
import { UserDecorator, UserIdDecorator } from "../../infrastructure/decorator/decorator.user";
import { PaginationType } from "../../types/pagination.types";
import { AuthBasic } from "../../infrastructure/guards/auth/basic.auth";
import { HttpExceptionFilter } from "../../exceptionFilters.ts/exceptionFilter";
import { UserClass } from "../../schema/user.schema";
import { CreateNewBlogCommand } from './use-case/createNewBlog-use-case';
import { UpdateBlogCommand } from './use-case/updateBlog-use-case';
import { Posts } from '../../schema/post.schema';
import { CreateNewPostForBlogCommand } from './use-case/createNewPostForBlog-use-case';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsService: BlogsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected postsService: PostsService,
    protected blogsRepository: BlogsRepository,
	protected commandBus: CommandBus
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
//   @UseFilters(new HttpExceptionFilter())
  async createBlog(@Body() inputDateModel: bodyBlogsModel) {
	const command = new CreateNewBlogCommand(inputDateModel)
	const createBlog: BlogsViewType = await this.commandBus.execute(command)
    // const createBlog: BlogsViewType = await this.blogsService.createNewBlog(
    //   inputDateModel,
    // );
    return createBlog;
  }
  
  @HttpCode(200)
  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param() dto: inputModelClass,
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
    const blog = await this.blogsQueryRepository.findBlogById(dto.blogId);
    if (!blog) throw new NotFoundException('Blogs by id not found');
    const getPosts: PaginationType<Posts> =
      await this.postsQueryRepository.findPostsByBlogsId(
        query.pageNumber || '1',
        query.pageSize || '10',
        query.sortBy || 'createdAt',
        query.sortDirection || 'desc',
        dto.blogId,
		userId
      );
    if (!getPosts) throw new NotFoundException('Blogs by id not found');
    return getPosts;
  }

  @HttpCode(201)
  @Post(':blogId/posts')
  @UseGuards(AuthBasic)
  async createPostByBlogId(
    @Param() dto: inputModelClass,
    @Body() inputDataModel: bodyPostsModelClass,
  ) {
    const findBlog: BlogsViewType | null = await this.blogsQueryRepository.findBlogById(dto.blogId);
    if (!findBlog) throw new NotFoundException('Blogs by id not found 404');
	const command = new CreateNewPostForBlogCommand( dto.blogId, inputDataModel, findBlog.name)
	const createNewPost: Posts | null = await this.commandBus.execute(command)
    // const isCreatePost = await this.postsService.createPost(
    //   blogId,
    //   inputDataModel.title,
    //   inputDataModel.shortDescription,
    //   inputDataModel.content,
    //   findBlog.name,
    // );
    if (!createNewPost) throw new NotFoundException('Blogs by id not found 404');
    return createNewPost;
  }

  @Get(':blogId')
  @HttpCode(200)
  async getBlogsById(
    @Param() dto: inputModelClass,
  ): Promise<BlogsViewType | null> {
    const blogById: BlogsViewType | null =
      await this.blogsQueryRepository.findBlogById(dto.blogId);
    if (!blogById) throw new NotFoundException('Blogs by id not found 404');
    return blogById;
  }

  @Put(':blogId')
  @HttpCode(204)
  @UseGuards(AuthBasic)
  @UseFilters(new HttpExceptionFilter())
  async updateBlogsById(
    @Param() dto: inputModelClass,
    @Body() inputDateMode: bodyBlogsModel,
  ) {
	const command = new UpdateBlogCommand(dto.blogId, inputDateMode)
	const isUpdateBlog = await this.commandBus.execute(command)
    // const isUpdateBlog: boolean = await this.blogsService.updateBlog(
    //   id,
    //   inputDateMode.name,
    //   inputDateMode.description,
    //   inputDateMode.websiteUrl,
    // );
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