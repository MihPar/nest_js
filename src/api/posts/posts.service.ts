import { Injectable } from "@nestjs/common"
import { PostsDB } from "./posts.class";
import { PostsRepository } from "./posts.repository";
import { LikeStatusEnum } from "src/api/likes/likes.emun";
import { ObjectId } from "mongodb";
import { likesRepository } from "src/api/likes/likes.repository";
import { PostClass, PostDocument } from "src/schema/post.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { LikeClass, LikeDocument } from "src/schema/likes.schema";
import { PostsViewModel, bodyPostsModel, inputModelPostType } from "./posts.type";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostClass.name) private postModel: Model<PostDocument>,
    @InjectModel(LikeClass.name) private likeModel: Model<LikeDocument>,
    protected postsRepository: PostsRepository,
    protected likesRepository: likesRepository,
  ) {}

  async createPost(
    blogId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogName: string,
  ): Promise<PostsViewModel | null> {
    const newPost: PostsDB = new PostsDB(
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    );
    const createPost: PostsDB = await this.postsRepository.createNewPosts(
      newPost,
    );
    const post = await this.postModel
      .findOne({ blogId: blogId }, { __v: 0 })
      .lean();
    const newestLikes = await this.likeModel
      .find({ postId: newPost._id })
      .sort({ addedAt: -1 })
      .limit(3)
      .skip(0)
      .lean();
    let myStatus: LikeStatusEnum = LikeStatusEnum.None;
    if (blogId) {
      const reaction = await this.likeModel.findOne({ blogId: blogId });
      myStatus = reaction
        ? (reaction.myStatus as unknown as LikeStatusEnum)
        : LikeStatusEnum.None;
    }
    return createPost.getPostViewModel(myStatus, newestLikes);
  }

  async updateOldPost(
	id: string,
	title: string,
	shortDescription: string,
	content: string,
	blogId: string
  ): Promise<boolean> {
	const updatPostById: boolean = await this.postsRepository.updatePost(
	  id,
	  title,
	  shortDescription,
	  content,
	  blogId
	);
	return updatPostById;
  }

  async deletePostId(id: string): Promise<boolean> {
	return await this.postsRepository.deletedPostById(id);
  }

  async deleteAllPosts() {
  	return await this.postsRepository.deleteRepoPosts();
  }
}