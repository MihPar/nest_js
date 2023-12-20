import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { PaginationType } from "src/types/pagination.types";
import { CommentViewModel, inputModeContentType } from "src/api/comment/comment.type";
import { Posts } from "./posts.class";
import { CommentService } from "src/api/comment/comment.service";
import { inputModelPostType } from "./posts.type";
import { likeStatusType } from "src/api/likes/likes.type";
import { PostsService } from './posts.service';
import { CommentQueryRepository } from "../comment/comment.queryRepository";
import { PostsQueryRepository } from "./postQuery.repository";

@Controller('api')
export class PostController {
	constructor(
		protected postsQueryRepository: PostsQueryRepository,
		protected commentQueryRepository: CommentQueryRepository,
		protected commentService: CommentService,
		protected postsService: PostsService,
	) {}

	@Put('posts/:postId/like-status')
	async updateLikeStatus(@Param() postId: string, @Body() inputModeLikeStatus: likeStatusType) {
	   const userId = req.user!._id;
   const userLogin = req.user.accountData.userName
   const findPost = await this.postsQueryRepository.findPostById(postId)
//    const result = await this.postsService.updateLikeStatus(inputModeLikeStatus.likeStatus, postId, userId, userLogin)
   const result = await this.postService.updateLikeStatus(inputModeLikeStatus.likeStatus, postId, userId, userLogin)
	}

	@Get('posts/:postId/comments')
	async getCommentByPostId(@Param("postId") postId: string, @Query() query: {pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}) {
		const userId = req.user?.id ?? null;
		const isExistPots = await this.postsQueryRepository.findPostById(postId);
		const commentByPostsId: PaginationType<CommentViewModel> | null =
			await this.commentQueryRepository.findCommentByPostId(
				postId,
				query.pageNumber = "1",
				query.pageSize = "10",
				query.sortBy = "createAt",
				query.sortDirection = "desc",
				userId
			);
	}
	@Post('posts/:postId/comments')
	async createCommentByPostid(@Param("postId") postId: string, @Body() inputDataContetn: inputModeContentType) {
	  const user = req.user;
	  const post: Posts | null = await this.postsQueryRepository.findPostById(postId);
	  const createNewCommentByPostId: CommentViewModel | null =
      await this.commentService.createNewCommentByPostId(
        postId,
        inputDataContetn.content,
        user._id.toString(),
        user.accountData.userName
      );
	}

	@Get('posts')
	async getPosts(@Query() query: {pageNumber: string, pageSize: string, sortBy: string, sortDirection: string, })
	 {
		const userId = req.user ? req.user._id.toString() : null
		const getAllPosts: PaginationType<Posts> =
      await this.postsQueryRepository.findAllPosts(
        query.pageNumber = "1",
        query.pageSize = "10",
        query.sortBy = "createAt",
        query.sortDirection = "desc",
		userId
      );
	 }

	 @Post('posts')
	 async createPost(@Body() inputModelPost: inputModelPostType) {
		const blog = req.blog
		const createNewPost: Posts | null = await this.postsService.createPost(
			inputModelPost.blogId,
			inputModelPost.title,
			inputModelPost.shortDescription,
			inputModelPost.content,
			blog!.name
		  )
	 }

	 @Get("posts/:id")
	 async getPostById(@Param("postId") postId: string) {
		const userId = req.user ? req.user._id.toString() : null
		const getPostById: Posts | null = await this.postsQueryRepository.findPostById(
			req.params.id, userId
		  );
	 }

	 @Put("posts/:id")
	 async updatePostById(@Param("postId") postId: string, @Body() inputModelData : inputModelPostType) {
		const updatePost: boolean = await this.postsService.updateOldPost(
			postId,
			inputModelData.blogId,
			inputModelData.title,
			inputModelData.shortDescription,
			inputModelData.content,
		  )
	 }

	 @Delete("posts/:id")
	 async deletePostById(@Param("postId") postId: string) {
		const deletPost: boolean = await this.postsService.deletePostId(postId)
	 }
}


