import { newestLikesType } from './../api/likes/likes.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatusEnum } from '../api/likes/likes.emun';
import { LikesInfoModel } from '../api/likes/likes.type';
import { PostsViewModel } from '../api/posts/posts.type';
import mongoose, { HydratedDocument } from 'mongoose';
import { LikeClass } from './likes.schema';


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

export type PostDocument = HydratedDocument<PostClass>;

@Schema({ _id: false, versionKey: false })
export class LikeInfoClass {
		// _id?: mongoose.Types.ObjectId;
	@Prop({required: true,})
		likesCount: number
	@Prop({required: true,})
		dislikesCount: number
}

export const LikeInfoSchema = SchemaFactory.createForClass(LikeInfoClass);

@Schema({ versionKey: false })
export class PostClass extends Posts {
	constructor(
		title: string,
		shortDescription: string,
		content: string,
		blogId: string,
		blogName: string,
		likesCount: number, 
		dislikesCount: number
	) {
		super(title, shortDescription, content, blogId, blogName);
	  	this._id = new mongoose.Types.ObjectId();
		this.extendedLikesInfo = {likesCount, dislikesCount}
	}
  	_id: mongoose.Types.ObjectId;
  @Prop({required: true, type: String})
  	title: string;
  @Prop({type: String, required: true})
  	shortDescription: string;
  @Prop({required: true})
 	content: string;
  @Prop({required: true})
  	blogId: string;
  @Prop({required: true})
 	 blogName: string;
  @Prop({required: true,})
  	createdAt: string;
  @Prop({required: true, type: LikeInfoSchema})
  	extendedLikesInfo: LikeInfoClass

	  static getPostsViewModel(post: PostClass, myStatus: LikeStatusEnum,
		newestLikes: LikeClass[]): PostsViewModel {
		return {
		  id: post._id.toString(),
		  title: post.title,
		  shortDescription: post.shortDescription,
		  content: post.content,
		  blogId: post.blogId,
		  blogName: post.blogName,
		  createdAt: post.createdAt,
		  extendedLikesInfo: {
			  dislikesCount: post.extendedLikesInfo.dislikesCount, 
			  likesCount: post.extendedLikesInfo.likesCount, 
			  myStatus, 
			  newestLikes: newestLikes.map(l => ({
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
		  extendedLikesInfo: {
			  dislikesCount: this.extendedLikesInfo.dislikesCount, 
			  likesCount: this.extendedLikesInfo.likesCount, 
			  myStatus, 
			  newestLikes
		  },
		};
	  }
}

export const PostSchema = SchemaFactory.createForClass(PostClass);

PostSchema.methods = {
	getPostViewModel: PostClass.prototype.getPostViewModel
}

PostSchema.statics = {
	getPostViewModel: PostClass.getPostsViewModel
}