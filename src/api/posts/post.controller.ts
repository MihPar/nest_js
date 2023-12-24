import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginationType } from 'src/types/pagination.types';
import { CommentViewModel } from 'src/api/comment/comment.type';
import { Posts } from './posts.class';
import { CommentService } from 'src/api/comment/comment.service';
import { inputModelPostType } from './posts.type';
import { PostsService } from './posts.service';
import { CommentQueryRepository } from '../comment/comment.queryRepository';
import { PostsQueryRepository } from './postQuery.repository';

@Controller('post')
export class PostController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected commentQueryRepository: CommentQueryRepository,
    protected commentService: CommentService,
    protected postsService: PostsService,
  ) {}

  @Get(':postId/comments')
  async getCommentByPostId(
    @Param('postId') postId: string,
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      sortBy: string;
      sortDirection: string;
    },
  ) {
    const isExistPots = await this.postsQueryRepository.findPostById(postId);
    const commentByPostsId: PaginationType<CommentViewModel> | null =
      await this.commentQueryRepository.findCommentByPostId(
        postId,
        (query.pageNumber = '1'),
        (query.pageSize = '10'),
        (query.sortBy = 'createAt'),
        (query.sortDirection = 'desc'),
      );
    if (!commentByPostsId) throw new NotFoundException('Blogs by id not found');
    return commentByPostsId;
  }

  @Get()
  async getPosts(
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      sortBy: string;
      sortDirection: string;
    },
  ) {
    // const userId = req.user ? req.user._id.toString() : null;
    const getAllPosts: PaginationType<Posts> =
      await this.postsQueryRepository.findAllPosts(
        (query.pageNumber = '1'),
        (query.pageSize = '10'),
        (query.sortBy = 'createAt'),
        (query.sortDirection = 'desc'),
      );
  }

  @Post()
  async createPost(@Body() inputModelPost: inputModelPostType) {
    const createNewPost: Posts | null = await this.postsService.createPost(
      inputModelPost,
    );
  }

  @Get(':id')
  async getPostById(@Param('postId') postId: string) {
    // const userId = req.user ? req.user._id.toString() : null;
    const getPostById: Posts | null =
      await this.postsQueryRepository.findPostById(postId);
    if (!getPostById) {
      throw new NotFoundException('Blogs by id not found');
    }
    return getPostById;
  }

  @Put(':id')
  async updatePostById(
    @Param('postId') postId: string,
    @Body() inputModelData: inputModelPostType,
  ) {
    const updatePost: boolean = await this.postsService.updateOldPost(
      postId,
      inputModelData,
    );
    if (!updatePost) throw new NotFoundException('Blogs by id not found');
    return updatePost;
  }

  @Delete(':id')
  async deletePostById(@Param('postId') postId: string): Promise<boolean> {
    const deletPost: boolean = await this.postsService.deletePostId(postId);
    if (!deletPost) throw new NotFoundException('Blogs by id not found');
    return true;
  }
}
