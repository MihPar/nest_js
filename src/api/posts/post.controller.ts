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
} from '@nestjs/common';
import { PaginationType } from '../../types/pagination.types';
import { CommentViewType } from '../comment/comment.type';
import { Posts } from './posts.class';
import { CommentService } from '../comment/comment.service';
import { inputModelPostType } from './posts.type';
import { PostsService } from './posts.service';
import { CommentQueryRepository } from '../comment/comment.queryRepository';
import { PostsQueryRepository } from './postQuery.repository';
import { Users } from '../users/user.class';

import { Blogs } from '../blogs/blogs.class';
import { BlogsQueryRepository } from '../blogs/blogs.queryReposity';
import { UserDecorator, UserIdDecorator } from '../../infrastructure/decorator/decorator.user';

@Controller('posts')
export class PostController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected commentQueryRepository: CommentQueryRepository,
    protected commentService: CommentService,
    protected postsService: PostsService,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

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
	// console.log("get comment by postId str 52: ", postId)
    const isExistPots = await this.postsQueryRepository.findPostById(postId);
	// console.log("postController 54 str, isExistPots: ", isExistPots)
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
    if (!commentByPostsId) throw new NotFoundException('Blogs by id not found');
    return commentByPostsId;
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
  async createPost(@Body() inputModelPost: inputModelPostType) {
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
  async updatePostById(
    @Param('id') postId: string,
    @Body() inputModelData: inputModelPostType,
  ) {
    const updatePost: boolean = await this.postsService.updateOldPost(
      postId,
      inputModelData.title,
      inputModelData.shortDescription,
      inputModelData.content,
      inputModelData.blogId,
    );
    if (!updatePost) throw new NotFoundException('Blogs by id not found');
    return updatePost;
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') postId: string): Promise<boolean> {
    const deletPost: boolean = await this.postsService.deletePostId(postId);
    if (!deletPost) throw new NotFoundException('Blogs by id not found');
    return true;
  }
}
