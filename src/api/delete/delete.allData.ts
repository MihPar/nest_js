import { Controller, Delete } from "@nestjs/common";
import { PostsService } from "src/api/posts/posts.service";
import { BlogsService } from "../blogs/blogs.service";
import { UserService } from "../users/user.service";
import { CommentService } from "../comment/comment.service";
import { DeviceService } from "../securityDevices/device.service";
import { IPCollectionService } from "../api.collection.ts/api.collectionService";

@Controller('api')
export class DeleteAllDataController {
	constructor(
		protected postsService: PostsService,
		protected blogsService: BlogsService,
		protected userService: UserService,
		protected commentService: CommentService,
		protected deviceService: DeviceService,
		protected IPCollectionService: IPCollectionService
	) {}
	@Delete('testing/all-data')
	async deleteAllData() {
    await this.postsService.deleteAllPosts();
    await this.blogsService.deleteAllBlogs();
    await this.userService.deleteAllUsers();
    await this.commentService.deleteAllComments();
    await this.deviceService.deleteAllDevices();
    await this.IPCollectionService.deleteAllCollection();
  }
	
}