import { LikesService } from './../likes/likes.service';
import { Controller, Delete, HttpCode } from "@nestjs/common";
import { PostsService } from "../posts/posts.service";
import { BlogsService } from "../blogs/blogs.service";
import { CommentService } from "../comment/comment.service";
import { UsersService } from '../users/user.service';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllPosts } from '../posts/use-case/deleteAllPosts-use-case';
import { DeleteAllBlogs } from '../blogs/use-case/deletAllBlogs-use-case';
import { DeleteAllUsers } from '../users/use-case/deleteAllUsers-use-case';
import { DeleteAllComments } from '../comment/use-case/deleteAllComments-use-case';
import { DeleteAllLikes } from '../likes/use-case/deleteAllLikes-use-case';

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
		await this.commandBus.execute(new DeleteAllPosts())
		await this.commandBus.execute(new DeleteAllBlogs())
		await this.commandBus.execute(new DeleteAllUsers())
		await this.commandBus.execute(new DeleteAllComments())
		await this.commandBus.execute(new DeleteAllLikes())

    // await this.postsService.deleteAllPosts();
    // await this.blogsService.deleteAllBlogs();
    // await this.userService.deleteAllUsers();
    // await this.commentService.deleteAllComments();
	// await this.likesService.deleteAllLikes()
  }
}