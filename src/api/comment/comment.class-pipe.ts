import { Transform, TransformFnParams } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import { applyDecorators } from "@nestjs/common";

// export class Comment {
// 	public createdAt: string;
//   public likesCount: number
//   public dislikesCount: number
// constructor(
//   public content: string,
//   public postId: string,
//   public commentatorInfo: CommentatorInfo,
// ) {
//   this.createdAt = new Date().toISOString();
//   this.likesCount = 0
//   this.dislikesCount = 0
// }
// }

// export class CommentsDB extends Comment {
// 	public _id: ObjectId;
// 	constructor(
// 	  content: string,
// 	  postId: string,
// 	  commentatorInfo: CommentatorInfo,
// 	) {
// 	  super(content, postId, commentatorInfo);
// 	  this._id = new ObjectId();
// 	}
// 	getNewComment(myStatus: LikeStatusEnum): CommentViewModel {
// 	  return {
// 		id: this._id.toString(),
// 		content: this.content,
// 		commentatorInfo: this.commentatorInfo,
// 		createdAt: this.createdAt,
// 		likesInfo: {
// 		  likesCount: this.likesCount,
// 		  dislikesCount: this.dislikesCount,
// 		  myStatus: myStatus
// 		}
// 	  };
// 	}
  
//   static getNewComments(comment: CommentsDB, myStatus: LikeStatusEnum): CommentViewModel {
// 	  return {
// 		id: comment._id.toString(),
// 		content: comment.content,
// 		commentatorInfo: comment.commentatorInfo,
// 		createdAt: comment.createdAt,
// 		likesInfo: {
// 		  likesCount: comment.likesCount,
// 		  dislikesCount: comment.dislikesCount,
// 		  myStatus: myStatus
// 		}
// 	  };
// 	}
//   }

//   const Trim = () => Transform(({value}: TransformFnParams) => value?.trim())

// function IsOptional() {
// 	return applyDecorators(IsString(), IsNotEmpty())
// }

const allowedValues = ['Like', 'Dislike', 'None']

  export class InputModelLikeStatusClass {
	@IsString()
	@IsNotEmpty()
	@Matches(new RegExp(`^(${allowedValues.join('|')})$`))
	likeStatus: string
  }

  export class inputModelCommentId {
	@IsMongoId()
	commentId: string
  }

  export class InputModelContent {
	@IsString()
	@IsNotEmpty()
	@MinLength(20)
	@MaxLength(300)
	content: string
  }

  export class inputModelId {
	@IsMongoId()
	id: string
  }