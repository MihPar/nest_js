import { ObjectId } from "mongodb";
import { LikeStatusEnum } from "src/likes/likes.emun";
import { LikesInfoModel, newestLikesType } from "src/likes/likes.type";
import { PostsViewModel } from "./posts.type";

export class Posts {
	public createdAt: string;
	public extendedLikesInfo!: LikesInfoModel;
	constructor(
	  public title: string,
	  public shortDescription: string,
	  public content: string,
	  public blogId: string,
	  public blogName: string,
	) {
	  this.createdAt = new Date().toISOString();
	  this.extendedLikesInfo = {
		  dislikesCount: 0,
		  likesCount: 0,
	  }
	}
  }
  
  export class PostsDB extends Posts {
	public _id: ObjectId;
	constructor(
	  title: string,
	  shortDescription: string,
	  content: string,
	  blogId: string,
	  blogName: string,
	) {
	  super(title, shortDescription, content, blogId, blogName, 
		  );
	  this._id = new ObjectId();
	}
	static getPostsViewModel(post: PostsDB, myStatus: LikeStatusEnum,
	  newestLikes: newestLikesType[]): PostsViewModel {
	  return {
		id: post._id.toString(),
		title: post.title,
		shortDescription: post.shortDescription,
		content: post.content,
		blogId: post.blogId,
		blogName: post.blogName,
		createdAt: post.createdAt,
		extendedLikesInfo: {...post.extendedLikesInfo, myStatus, newestLikes: newestLikes.map(l => ({
		  addedAt: l.addedAt,
		  login: l.login,
		  userId: l.userId
		}))},
	  };
	}
	getPostViewModel(myStatus: LikeStatusEnum,
	  newestLikes: newestLikesType[]): PostsViewModel {
	  return {
		id: this._id.toString(),
		title: this.title,
		shortDescription: this.shortDescription,
		content: this.content,
		blogId: this.blogId,
		blogName: this.blogName,
		createdAt: this.createdAt,
		extendedLikesInfo: {...this.extendedLikesInfo, myStatus, newestLikes},
	  };
	}
  }