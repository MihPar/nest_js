import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CommentViewModel, CommentatorInfo } from "../api/comment/comment.type";
import { ObjectId } from "mongodb";
import { LikeStatusEnum } from "../api/likes/likes.emun";

export class Comment {
  public createdAt: string;
  public likesCount: number;
  public dislikesCount: number;
  constructor(
    public content: string,
    public postId: string,
    public commentatorInfo: CommentatorInfo,
  ) {
    this.createdAt = new Date().toISOString();
    this.likesCount = 0;
    this.dislikesCount = 0;
  }
}

export type CommentDocument = HydratedDocument<CommentClass>

@Schema({ _id: false, versionKey: false })
export class ComentatorInfoClass {
	@Prop({required: true})
		userId: string
	@Prop({reuqired: true})
		userLogin: string
}

export const ComentatorInfoSchema = SchemaFactory.createForClass(ComentatorInfoClass)

@Schema({ _id: false, versionKey: false })
export class CommentClass extends Comment {
	constructor(
	  content: string,
	  postId: string,
	  commentatorInfo: CommentatorInfo,
	) {
	  super(content, postId, commentatorInfo);
	  this._id = new ObjectId();
	}
		_id?: mongoose.Types.ObjectId;
	@Prop({requierd: true})
		content: string
	@Prop({required: true})
		commentatorInfo: ComentatorInfoClass
	@Prop({require: true})
		postId: string
	@Prop({required: true})
		createdAt: string
	@Prop({required: true})
		likesCount: number
	@Prop({required: true})
		dislikesCount: number

		getNewComment(myStatus: LikeStatusEnum): CommentViewModel {
			return {
			  id: this._id!.toString(),
			  content: this.content,
			  commentatorInfo: this.commentatorInfo,
			  createdAt: this.createdAt,
			  likesInfo: {
				likesCount: this.likesCount,
				dislikesCount: this.dislikesCount,
				myStatus: myStatus
			  }
			};
		  }
		
		static getNewComments(comment: CommentClass, myStatus: LikeStatusEnum): CommentViewModel {
			return {
			  id: comment._id!.toString(),
			  content: comment.content,
			  commentatorInfo: comment.commentatorInfo,
			  createdAt: comment.createdAt,
			  likesInfo: {
				likesCount: comment.likesCount,
				dislikesCount: comment.dislikesCount,
				myStatus: myStatus
			  }
			};
		  }
}

export const CommentSchema = SchemaFactory.createForClass(CommentClass)