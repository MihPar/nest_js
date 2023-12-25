import { Controller, Delete } from "@nestjs/common";
import { PostsService } from "src/api/posts/posts.service";
import { BlogsService } from "../blogs/blogs.service";
import { UserService } from "../users/user.service";
import { CommentService } from "../comment/comment.service";
@Controller('testing/all-data')
export class DeleteAllDataController {
	constructor(
		protected postsService: PostsService,
		protected blogsService: BlogsService,
		protected userService: UserService,
		protected commentService: CommentService,
	) {}
	@Delete()
	async deleteAllData() {
    await this.postsService.deleteAllPosts();
    await this.blogsService.deleteAllBlogs();
    await this.userService.deleteAllUsers();
    await this.commentService.deleteAllComments();
  }
	
}