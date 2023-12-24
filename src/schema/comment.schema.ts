import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CommentDocument = HydratedDocument<CommentClass>

@Schema()
export class ComentatorInfoClass {
	@Prop({required: true})
		userId: string
	@Prop({reuqired: true})
		userLogin: string
}

export const ComentatorInfoSchema = SchemaFactory.createForClass(ComentatorInfoClass)

@Schema()
export class CommentClass {
		_id:  Types.ObjectId
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
}

export const CommentSchema = SchemaFactory.createForClass(CommentClass)