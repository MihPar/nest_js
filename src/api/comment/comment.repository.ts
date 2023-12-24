import { CommentsDB } from "./comment.class";
import { ObjectId } from "mongodb";
import { CommentClass, CommentDocument } from "src/schema/comment.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

export class CommentRepository {
	constructor(
		@InjectModel(CommentClass.name) private commentModel: Model<CommentDocument>
	) {}
	async createNewCommentPostId(newComment: CommentsDB) {
		await this.commentModel.create(newComment);
		return newComment
	}

	async deleteAllComments() {
		const deletedAll = this.commentModel.deleteMany({});
		// return deletedAll.acknowledged;
		return deletedAll.deleteMany()
	}

	async increase(commentId: string, likeStatus: string){
		if(likeStatus !== 'Dislike' && likeStatus !== 'Like') {
			return
		} 
		return await this.commentModel.updateOne({_id: new ObjectId(commentId)}, {$inc: likeStatus === 'Dislike' ? {dislikesCount: 1} : {likesCount: 1}})
	}

	async decrease(commentId: string, likeStatus: string){
		if(likeStatus !== 'Dislike' && likeStatus !== 'Like') {
			return
		} 
		return await this.commentModel.updateOne({_id: new ObjectId(commentId)}, {$inc: likeStatus === 'Dislike' ? {dislikesCount: -1} : {likesCount: -1}})
	}

	async updateComment(commentId: string, content: string) {
		const updateOne = await this.commentModel.updateOne(
		  { _id: new ObjectId(commentId) },
		  { $set: { content: content } }
		);
		return updateOne.matchedCount === 1;
	  }

	async deleteComment(commentId: string) {
		try {
			const deleteComment = await this.commentModel.deleteOne({
			  _id: new ObjectId(commentId),
			});
			return deleteComment.deletedCount === 1;
		  } catch (err) {
			return false; 
		  }
	}
}