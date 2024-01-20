import { LikesService } from './../likes/likes.service';
import { Controller, Delete, HttpCode } from "@nestjs/common";
import { PostsService } from "../posts/posts.service";
import { BlogsService } from "../blogs/blogs.service";
import { CommentService } from "../comment/comment.service";
import { UsersService } from '../users/user.service';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllPostsComand } from '../posts/use-case/deleteAllPosts-use-case';
import { DeleteAllBlogsCommnad } from '../blogs/use-case/deletAllBlogs-use-case';
import { DeleteAllUsersCommnad } from '../users/use-case/deleteAllUsers-use-case';
import { DeleteAllCommentsCommand } from '../comment/use-case/deleteAllComments-use-case';
import { DeleteAllLikesCommnad } from '../likes/use-case/deleteAllLikes-use-case';

@Controller('testing/all-data')
export class DeleteAllDataController {
	constructor(
		protected postsService: PostsService,
		protected blogsService: BlogsService,
		protected userService: UsersService,
		protected commentService: CommentService,
		protected likesService: LikesService,
		protected commandBus: CommandBus
	) {}
	@Delete()
	@HttpCode(204)
	async deleteAllData() {
		await this.commandBus.execute(new DeleteAllPostsComand())
		await this.commandBus.execute(new DeleteAllBlogsCommnad())
		await this.commandBus.execute(new DeleteAllUsersCommnad())
		await this.commandBus.execute(new DeleteAllCommentsCommand())
		await this.commandBus.execute(new DeleteAllLikesCommnad())

    // await this.postsService.deleteAllPosts();
    // await this.blogsService.deleteAllBlogs();
    // await this.userService.deleteAllUsers();
    // await this.commentService.deleteAllComments();
	// await this.likesService.deleteAllLikes()
  }
}