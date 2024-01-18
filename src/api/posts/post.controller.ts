import {
	BadRequestException,
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
import { InputModelClassPostId, InputModelContentePostClass, inputModelPostClass } from './posts.class';
import { CommentService } from '../comment/comment.service';
import { PostsService } from './posts.service';
import { CommentQueryRepository } from '../comment/comment.queryRepository';
import { PostsQueryRepository } from './postQuery.repository';
import { BlogsQueryRepository } from '../blogs/blogs.queryReposity';
import { UserDecorator, UserIdDecorator } from '../../infrastructure/decorator/decorator.user';
import { InputModelLikeStatusClass } from '../comment/comment.class-pipe';
import { HttpExceptionFilter } from '../../exceptionFilters.ts/exceptionFilter';
import { CheckRefreshTokenForPost } from '../../infrastructure/guards/post/bearer.authForPost';
import { AuthBasic } from '../../infrastructure/guards/auth/basic.auth';
import { UserClass } from '../../schema/user.schema';
import { BlogClass } from '../../schema/blogs.schema';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNewCommentByPostId } from '../comment/use-case/createNewCommentByPotsId-use-case';
import { CreatePost } from './use-case/createPost-use-case';
import { Posts } from '../../schema/post.schema';
import { UpdateOldPost } from './use-case/updateOldPost-use-case';
import { DeletePostById } from './use-case/deletePostById-use-case';
import { UpdateLikeStatusCommand } from './use-case/updateLikeStatus-use-case';

@Controller('posts')
export class PostController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected commentQueryRepository: CommentQueryRepository,
    protected commentService: CommentService,
    protected postsService: PostsService,
    protected blogsQueryRepository: BlogsQueryRepository,
	protected commandBus: CommandBus
  ) {}

  @Put(':postId/like-status')
  @HttpCode(204)
//   @UseFilters(new HttpExceptaionFilter())
  @UseGuards(CheckRefreshTokenForPost)
  async updateLikeStatus(
	@Param() dto: InputModelClassPostId, 
	@Body() status: InputModelLikeStatusClass,
	@UserDecorator() user: UserClass, 
    @UserIdDecorator() userId: string | null,
	) {
	if(!userId) return null
	console.log(userId, "userId")
    const findPost = await this.postsQueryRepository.findPostById(dto.postId);
	console.log(findPost, "findPost 62 str")
    if (!findPost) throw new NotFoundException('404')
	const result = await this.commandBus.execute(new UpdateLikeStatusCommand(status, dto, userId, user))
    // const result = await this.postsService.updateLikeStatus(
    //   status.likeStatus,
    //   dto.postId,
    //   new ObjectId(userId),
    //   userLogin
    // );
    if (!result) throw new NotFoundException('404')
	return
  }

  @Get(':postId/comments')
  @HttpCode(200)
  async getCommentByPostId(
    @Param('postId') postId: string,
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
//   @UseFilters(new HttpExceptionFilter())
  @UseGuards(CheckRefreshTokenForPost)
  async createNewCommentByPostId(
	@Param() dto: InputModelClassPostId, 
	@Body() inputModelContent: InputModelContentePostClass,
  	@UserDecorator() user: UserClass,
    @UserIdDecorator() userId: string | null
	) {
    const post: Posts | null = await this.postsQueryRepository.findPostById(dto.postId)

    if (!post) throw new NotFoundException('Blogs by id not found 404')

	if(!userId) return null
	const createNewCommentByPostId: CommentViewModel | null = await this.commandBus.execute(new CreateNewCommentByPostId(dto, inputModelContent, user, userId))
    // const createNewCommentByPostId: CommentViewModel | null =
    //   await this.commentService.createNewCommentByPostId(
    //     dto.postId,
    //     inputModelContent.content,
    //     userId,
    //     user.accountData.userName
    //   );
    if (!createNewCommentByPostId) throw new NotFoundException('Blogs by id not found 404')
  }

  @Get()
  @HttpCode(200)
  async getPosts(
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
//   @UseFilters(new HttpExceptionFilter())
  async createPost(@Body() inputModelPost: inputModelPostClass) {
    const findBlog: BlogClass | null = await this.blogsQueryRepository.findRawBlogById(
      inputModelPost.blogId,
    );

    if (!findBlog) throw new BadRequestException('Blogs by id not found 400');
	const createNewPost: Posts | null = await this.commandBus.execute(new CreatePost(inputModelPost, findBlog.name))
    // const createNewPost: Posts | null = await this.postsService.createPost(
    //   inputModelPost.blogId,
    //   inputModelPost.title,
    //   inputModelPost.shortDescription,
    //   inputModelPost.content,
    //   findBlog.name,
    // );
	if(!createNewPost) throw new BadRequestException('Blogs by id not found 400');
    return createNewPost;
  }

  @Get(':id')
  @HttpCode(200)
  async getPostById(
    @Param('id') postId: string,
	@UserIdDecorator() userId: string | null,
  ) {
    const getPostById: Posts | null =
      await this.postsQueryRepository.findPostById(postId, userId);
    if (!getPostById) {
      throw new NotFoundException('Post by id not found');
    }
    return getPostById;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(AuthBasic)
//   @UseFilters(new HttpExceptionFilter())
  async updatePostById(
    @Param('id') postId: string,
    @Body() inputModelData: inputModelPostClass,
  ) {
	const updatePost: boolean = await this.commandBus.execute(new UpdateOldPost(postId, inputModelData))
    // const updatePost: boolean = await this.postsService.updateOldPost(
    //   postId,
    //   inputModelData.title,
    //   inputModelData.shortDescription,
    //   inputModelData.content,
    //   inputModelData.blogId,
    // );
    if (!updatePost) throw new NotFoundException('Blogs by id not found 404');
    return
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthBasic)
  async deletePostById(@Param('id') postId: string): Promise<boolean> {
	const deletPost: boolean = await this.commandBus.execute(new DeletePostById(postId))
    // const deletPost: boolean = await this.postsService.deletePostId(postId);
    if (!deletPost) throw new NotFoundException('Blogs by id not found 404');
    return true;
  }
}
