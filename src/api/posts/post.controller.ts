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
import { PaginationType } from 'src/types/pagination.types';
import { CommentViewType } from 'src/api/comment/comment.type';
import { Posts } from './posts.class';
import { CommentService } from 'src/api/comment/comment.service';
import { inputModelPostType } from './posts.type';
import { PostsService } from './posts.service';
import { CommentQueryRepository } from '../comment/comment.queryRepository';
import { PostsQueryRepository } from './postQuery.repository';
import { Users } from '../users/user.class';
import { UserDecorator, UserIdDecorator } from 'src/infrastructure/decorator/decorator.user';
import { Blogs } from '../blogs/blogs.class';
import { BlogsQueryRepository } from '../blogs/blogs.queryReposity';

@Controller('post')
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
    const isExistPots = await this.postsQueryRepository.findPostById(postId);
    if (!isExistPots) throw new NotFoundException('Blogs by id not found');
    const commentByPostsId: PaginationType<CommentViewType> | null =
      await this.commentQueryRepository.findCommentByPostId(
        postId,
        (query.pageNumber = '1'),
        (query.pageSize = '10'),
        (query.sortBy = 'createAt'),
        (query.sortDirection = 'desc'),
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
    const getAllPosts: PaginationType<Posts> =
      await this.postsQueryRepository.findAllPosts(
        (query.pageNumber = '1'),
        (query.pageSize = '10'),
        (query.sortBy = 'createAt'),
        (query.sortDirection = 'desc'),
        userId,
      );
    return getAllPosts;
  }

  @Post()
  async createPost(@Body() inputModelPost: inputModelPostType) {
    const findBlog: Blogs = await this.blogsQueryRepository.findBlogById(
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
