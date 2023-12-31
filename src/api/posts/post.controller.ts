import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { PaginationType } from '../../types/pagination.types';
import { CommentViewModel, CommentViewType } from '../comment/comment.type';
import { InputModelClassPostId, InputModelContentePostClass, Posts, inputModelPostClass } from './posts.class';
import { CommentService } from '../comment/comment.service';
import { PostsService } from './posts.service';
import { CommentQueryRepository } from '../comment/comment.queryRepository';
import { PostsQueryRepository } from './postQuery.repository';
import { Users } from '../users/user.class';

import { Blogs } from '../blogs/blogs.class';
import { BlogsQueryRepository } from '../blogs/blogs.queryReposity';
import { UserDecorator, UserIdDecorator } from '../../infrastructure/decorator/decorator.user';
import { InputModelLikeStatusClass } from '../../api/comment/comment.class';
import { HttpExceptionFilter } from '../../exceptionFilters.ts/exceptionFilter';
import { CheckRefreshTokenForPost } from '../../infrastructure/guards/post/bearer.authForPost';
import { AuthBasic } from '../../infrastructure/guards/auth/basic.auth';
import { ObjectId } from 'mongodb';

@Controller('posts')
export class PostController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected commentQueryRepository: CommentQueryRepository,
    protected commentService: CommentService,
    protected postsService: PostsService,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Put()
  @HttpCode(204)
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(CheckRefreshTokenForPost)
  async updateLikeStatus(
	@Param() dto: InputModelClassPostId, 
	@Body() status: InputModelLikeStatusClass,
	@UserDecorator() user: Users,
    @UserIdDecorator() userId: string | null,
	) {
    const userLogin = user.accountData.userName;
	if(!userId) return null
    const findPost = await this.postsQueryRepository.findPostById(dto.postId);
    if (!findPost) throw new NotFoundException('404')

    const result = await this.postsService.updateLikeStatus(
      status.likeStatus,
      dto.postId,
      new ObjectId(userId),
      userLogin
    );
    if (!result) throw new NotFoundException('404')
  }

  @Get(':postId/comments')
  @HttpCode(200)
  async getCommentByPostId(
    @Param('postId') postId: string,
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
	if(!userId) return null
    const isExistPots = await this.postsQueryRepository.findPostById(postId);
    if (!isExistPots) throw new NotFoundException('Blogs by id not found');
    const commentByPostsId: PaginationType<CommentViewType> | null =
      await this.commentQueryRepository.findCommentByPostId(
        postId,
        (query.pageNumber || '1'),
        (query.pageSize || '10'),
        (query.sortBy || 'createdAt'),
        (query.sortDirection || 'desc'),
        userId,
      );
    if (!commentByPostsId) throw new NotFoundException('Blogs by id not found 404');
    return commentByPostsId;
  }

  @Post(':postId/comments')
  @HttpCode(201)
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(CheckRefreshTokenForPost)
  async createNewCommentByPostId(
	@Param() dto: InputModelClassPostId, 
	@Body() inputModelContent: InputModelContentePostClass,
  	@UserDecorator() user: Users,
    @UserIdDecorator() userId: string | null
	) {
    const post: Posts | null = await this.postsQueryRepository.findPostById(dto.postId)

    if (!post) throw new NotFoundException('Blogs by id not found 404')

	if(!userId) return null
    const createNewCommentByPostId: CommentViewModel | null =
      await this.commentService.createNewCommentByPostId(
        dto.postId,
        inputModelContent.content,
        userId,
        user.accountData.userName
      );
    if (!createNewCommentByPostId) throw new NotFoundException('Blogs by id not found 404')
  }

  @Get()
  @HttpCode(200)
  async getPosts(
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
	if(!userId) return null
    const getAllPosts: PaginationType<Posts> =
      await this.postsQueryRepository.findAllPosts(
        (query.pageNumber || '1'),
        (query.pageSize || '10'),
        (query.sortBy || 'createdAt'),
        (query.sortDirection || 'desc'),
        userId,
      );
    return getAllPosts;
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthBasic)
  @UseFilters(new HttpExceptionFilter())
  async createPost(@Body() inputModelPost: inputModelPostClass) {
    const findBlog: Blogs | null = await this.blogsQueryRepository.findBlogById(
      inputModelPost.blogId,
    );
    if (!findBlog) throw new NotFoundException('Blogs by id not found');
    const createNewPost: Posts | null = await this.postsService.createPost(
      inputModelPost.blogId,
      inputModelPost.title,
      inputModelPost.shortDescription,
      inputModelPost.content,
      findBlog.name,
    );
    return createNewPost;
  }

  @Get(':id')
  @HttpCode(200)
  async getPostById(
    @Param('id') postId: string,
    @UserDecorator() user: Users,
    @UserIdDecorator() userId: string | null,
  ) {
	if(!userId) return null
    const getPostById: Posts | null =
      await this.postsQueryRepository.findPostById(postId, userId);
    if (!getPostById) {
      throw new NotFoundException('Blogs by id not found');
    }
    return getPostById;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(AuthBasic)
  @UseFilters(new HttpExceptionFilter())
  async updatePostById(
    @Param('id') postId: string,
    @Body() inputModelData: inputModelPostClass,
  ) {
    const updatePost: boolean = await this.postsService.updateOldPost(
      postId,
      inputModelData.title,
      inputModelData.shortDescription,
      inputModelData.content,
      inputModelData.blogId,
    );
    if (!updatePost) throw new NotFoundException('Blogs by id not found 404');
    return updatePost;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthBasic)
  async deletePostById(@Param('id') postId: string): Promise<boolean> {
    const deletPost: boolean = await this.postsService.deletePostId(postId);
    if (!deletPost) throw new NotFoundException('Blogs by id not found 404');
    return true;
  }
}
