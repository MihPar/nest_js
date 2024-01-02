import { LikesService } from './../likes/likes.service';
import { Controller, Delete, HttpCode } from "@nestjs/common";
import { PostsService } from "../posts/posts.service";
import { BlogsService } from "../blogs/blogs.service";
import { CommentService } from "../comment/comment.service";
import { UsersService } from 'api/users/user.service';

@Controller('testing/all-data')
export class DeleteAllDataController {
	constructor(
		protected postsService: PostsService,
		protected blogsService: BlogsService,
		protected userService: UsersService,
		protected commentService: CommentService,
		protected likesService: LikesService
	) {}
	@Delete()
	@HttpCode(204)
	async deleteAllData() {
    await this.postsService.deleteAllPosts();
    await this.blogsService.deleteAllBlogs();
    await this.userService.deleteAllUsers();
    await this.commentService.deleteAllComments();
	await this.likesService.deleteAllLikes()
  }
}