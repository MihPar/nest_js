import { Transform, TransformFnParams } from "class-transformer";
import { applyDecorators } from "@nestjs/common";
import { IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";

// export class Posts {
// 	public createdAt: string;
// 	public extendedLikesInfo!: LikesInfoModel;
// 	constructor(
// 	  public title: string,
// 	  public shortDescription: string,
// 	  public content: string,
// 	  public blogId: string,
// 	  public blogName: string,
// 	) {
// 	  this.createdAt = new Date().toISOString();
// 	  this.extendedLikesInfo = {
// 		  dislikesCount: 0,
// 		  likesCount: 0,
// 	  }
// 	}
//   }
  
//   export class PostsDB extends Posts {
// 	public _id: ObjectId;
// 	constructor(
// 	  title: string,
// 	  shortDescription: string,
// 	  content: string,
// 	  blogId: string,
// 	  blogName: string,
// 	) {
// 	  super(title, shortDescription, content, blogId, blogName);
// 	  this._id = new mongoose.Types.ObjectId();
// 	}
// 	static getPostsViewModel(post: PostsDB, myStatus: LikeStatusEnum,
// 	  newestLikes: newestLikesType[]): PostsViewModel {
// 	  return {
// 		id: post._id.toString(),
// 		title: post.title,
// 		shortDescription: post.shortDescription,
// 		content: post.content,
// 		blogId: post.blogId,
// 		blogName: post.blogName,
// 		createdAt: post.createdAt,
// 		extendedLikesInfo: {
// 			dislikesCount: post.extendedLikesInfo.dislikesCount, 
// 			likesCount: post.extendedLikesInfo.likesCount, 
// 			myStatus, 
// 			newestLikes: newestLikes.map(l => ({
// 				addedAt: l.addedAt,
// 				login: l.login,
// 				userId: l.userId
// 			}))},
// 		};
// 	}
// 	getPostViewModel(myStatus: LikeStatusEnum,
// 	  newestLikes: newestLikesType[]): PostsViewModel {
// 	  return {
// 		id: this._id.toString(),
// 		title: this.title,
// 		shortDescription: this.shortDescription,
// 		content: this.content,
// 		blogId: this.blogId,
// 		blogName: this.blogName,
// 		createdAt: this.createdAt,
// 		extendedLikesInfo: {
// 			dislikesCount: this.extendedLikesInfo.dislikesCount, 
// 			likesCount: this.extendedLikesInfo.likesCount, 
// 			myStatus, 
// 			newestLikes
// 		},
// 	  };
// 	}
//   }

// const Trim = () => Transform(({value}: TransformFnParams) => {
// 	// console.log(value, "value trim")
// 	return value?.trim()
// })

export const IsCustomString = () => applyDecorators(IsString(), IsNotEmpty())


  export class bodyPostsModelClass {
	@IsCustomString()
	@Length(0, 30, {message: "length is incorrect"})
	title: string
	@IsCustomString()
	@Length(0, 100, {message: "length is incorrect"})
	shortDescription: string
	@IsCustomString()
	@Length(0, 1000, {message: "length is incorrect"})
	content: string
}

export class inputModelPostClass {
	@IsCustomString()
	@Length(1, 30, {message: "length is incorrect"})
	title: string
	@IsCustomString()
	@Length(1, 100, {message: "length is incorrect"})
	shortDescription: string
	@IsCustomString()
	@Length(1, 1000, {message: "length is incorrect"})
	content: string
	@IsCustomString()
	blogId: string
  }

  export class InputModelClassPostId {
	@IsMongoId()
	postId: string
  }

  export class InputModelContentePostClass {
	@IsCustomString()
	@Length(20, 300, {message: "Content should be lenght from 20 to 300 symbols"})
	content: string
  }