import { Controller, Delete } from "@nestjs/common";
import { PostsService } from "src/api/posts/posts.service";
import { BlogsService } from "../blogs/blogs.service";
import { UserService } from "../users/user.service";

@Controller()
export class DeleteAllDataController {
	constructor(
		protected postsService: PostsService,
		protected blogsService: BlogsService,
		protected userService: UserService,
	) {}
	@Delete()
	async deleteAllData() {
    await this.postsService.deleteAllPosts();
    await this.blogsService.deleteAllBlogs();
    await this.userService.deleteAllUsers();
    await commentService.deleteAllComments();
    await deviceService.deleteAllDevices();
    await IPCollectionModel.deleteMany({});
  }
	
}