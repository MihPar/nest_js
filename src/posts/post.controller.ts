import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { PostsQueryRepositories } from "./postQuery.repository";
import { PaginationType } from "src/types/pagination.types";
import { CommentViewModel, inputModeContentType } from "src/comment/comment.type";
import { CommentQueryRepositories } from "src/comment/comment.queryRepository";
import { Posts } from "./posts.class";
import { CommentService } from "src/comment/comment.service";
import { inputModelPostType } from "./posts.type";
import { postsService } from "./posts.service";
import { likeStatusType } from "src/likes/likes.type";

@Controller("comments")
export class PostController {
	constructor(
		protected postsQueryRepositories: PostsQueryRepositories,
		protected commentQueryRepositories: CommentQueryRepositories,
		protected commentService: CommentService,
		protected postsService: postsService
	) {}
	@Get(":id")
	async getCommentByPostId(@Param("postId") postId: string, @Query() query: {pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}) {
		const userId = req.user?.id ?? null;
		const isExistPots = await this.postsQueryRepositories.findPostById(postId);
		const commentByPostsId: PaginationType<CommentViewModel> | null =
			await this.commentQueryRepositories.findCommentByPostId(
				postId,
				query.pageNumber = "1",
				query.pageSize = "10",
				query.sortBy = "createAt",
				query.sortDirection = "desc",
				userId
			);
	}
	@Post(':id')
	async createCommentByPostid(@Param("postId") postId: string, @Body() inputDataContetn: inputModeContentType) {
	  const user = req.user;
	  const post: Posts | null = await this.postsQueryRepositories.findPostById(postId);
	  const createNewCommentByPostId: CommentViewModel | null =
      await this.commentService.createNewCommentByPostId(
        postId,
        inputDataContetn.content,
        user._id.toString(),
        user.accountData.userName
      );
	}

	@Get()
	async getPosts(@Query() query: {pageNumber: string, pageSize: string, sortBy: string, sortDirection: string, })
	 {
		const userId = req.user ? req.user._id.toString() : null
		const getAllPosts: PaginationType<Posts> =
      await this.postsQueryRepositories.findAllPosts(
        query.pageNumber = "1",
        query.pageSize = "10",
        query.sortBy = "createAt",
        query.sortDirection = "desc",
		userId
      );
	 }

	 @Post()
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

	 @Get(":id")
	 async getPostById(@Param("postId") postId: string) {
		const userId = req.user ? req.user._id.toString() : null
		const getPostById: Posts | null = await this.postsQueryRepositories.findPostById(
			req.params.id, userId
		  );
	 }

	 @Put(":id")
	 async updatePostById(@Param("postId") postId: string, @Body() inputModelData : inputModelPostType) {
		const updatePost: boolean = await this.postsService.updateOldPost(
			postId,
			inputModelData.blogId,
			inputModelData.title,
			inputModelData.shortDescription,
			inputModelData.content,
		  )
	 }

	 @Put(":id")
	 async updateLikeStatus(@Param() postId: string, @Body() inputModeLikeStatus: likeStatusType) {
		const userId = req.user!._id;
	const userLogin = req.user.accountData.userName
	const findPost = await this.postsQueryRepositories.findPostById(postId)
	const result = await this.postsService.updateLikeStatus(inputModeLikeStatus.likeStatus, postId, userId, userLogin)
	 }

	 @Delete(":id")
	 async deletePostById(@Param("postId") postId: string) {
		const deletPost: boolean = await this.postsService.deletePostId(postId)
	 }
}