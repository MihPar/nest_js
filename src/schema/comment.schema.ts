// import mongoose from 'mongoose'
// import { WithId } from 'mongodb'
// import { CommentsDB } from './comment.class'

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// export const CommentSchema = new mongoose.Schema<WithId<CommentsDB>>({
// 	content: {type: String, required: true},
// 	commentatorInfo: {
// 		userId: {type: String, required: true},
// 		userLogin: {type: String, required: true},
// 	},
// 	postId: {type: String, required: true},
// 	createdAt: {type: String, required: true},
// 	likesCount: {type: Number, required: true},
// 	dislikesCount: {type: Number, required: true}
// })

export type CommentDocument = HydratedDocument<CommentClass>

@Schema()
export class CommentClass {
	@Prop({
		requierd: true
	})
	content: string

	@Prop({
		required: true
	})
	commentatorInfo: {
				userId: string,
				userLogin: string,
			}

	@Prop({
		require: true
	})
	postId: string

	@Prop({
		required: true
	})
	createdAt: string

	@Prop({
		 required: true
	})
	likesCount: number

	@Prop({
		required: true
	})
	dislikesCount: number
}

export const CommentSchema = SchemaFactory.createForClass(CommentClass)