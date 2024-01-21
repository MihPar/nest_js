import { Transform, TransformFnParams } from "class-transformer";
import { applyDecorators } from "@nestjs/common";
import { IsEnum, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { IsBlogExist } from "../../infrastructure/guards/post/pipe/blogIsExistDecorator";
import { LikeStatusEnum } from "../likes/likes.emun";

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

const Trim = () => Transform(({value}: TransformFnParams) => {
	return value?.trim()
})

export const IsCustomString = () => applyDecorators(IsString(), Trim(), IsNotEmpty())


  export class bodyPostsModelClass {
	// @IsCustomString()
	@IsString()
	@Trim() 
	@IsNotEmpty()
	@MaxLength(30)
	title: string

	// @IsCustomString()
	@IsString()
	@Trim() 
	@IsNotEmpty()
	@MaxLength(100)
	shortDescription: string

	// @IsCustomString()
	@IsString()
	@Trim() 
	@IsNotEmpty()
	@MaxLength(1000)
	content: string
}

export class inputModelPostClass {
	// @IsCustomString()
	@IsString()
	// @Trim() 
	@IsNotEmpty()
	@MaxLength(30)
	title: string

	// @IsCustomString()
	@IsString()
	// @Trim() 
	@IsNotEmpty()
	@MaxLength(100)
	shortDescription: string

	// @IsCustomString()
	@IsString()
	// @Trim() 
	@IsNotEmpty()
	@MaxLength(1000)
	content: string
	
	@IsBlogExist({message:'blog not found'})
	@IsCustomString()
	blogId: string
  }

  export class InputModelClassPostId {
	@IsMongoId()
	postId: string
  }

  export class InputModelContentePostClass {
	// @IsCustomString()
	
	@IsString()
	@Trim() 
	@IsNotEmpty()
	@MaxLength(300)
    @MinLength(20)
	content: string
  }

  export class likesDto {
    @IsEnum(LikeStatusEnum)
    likeStatus: LikeStatusEnum
}