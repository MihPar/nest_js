import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { CommentsDB } from './comment.class'

export const CommentSchema = new mongoose.Schema<WithId<CommentsDB>>({
	content: {type: String, required: true},
	commentatorInfo: {
		userId: {type: String, required: true},
		userLogin: {type: String, required: true},
	},
	postId: {type: String, required: true},
	createdAt: {type: String, required: true},
	likesCount: {type: Number, required: true},
	dislikesCount: {type: Number, required: true}
})