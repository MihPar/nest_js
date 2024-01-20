import { CommentClass, CommentDocument } from "../../schema/comment.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";

export class CommentRepository {
	constructor(
		@InjectModel(CommentClass.name) private commentModel: Model<CommentDocument>
	) {}

	async deleteAllComments() {
		const deletedAll = await this.commentModel.deleteMany({});
		return deletedAll.deletedCount === 1;
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

	  async deleteComment(commentId: string): Promise<boolean> {
		try {
		  const deleteComment = await this.commentModel.deleteOne({
			_id: new ObjectId(commentId),
		  }).exec()
		  return deleteComment.deletedCount === 1;
		} catch (err) {
		  return false; 
		}
	  }

	  async createNewCommentPostId(newComment: CommentClass): Promise<CommentClass | null> {
		// try {
			const saveComment = await this.commentModel.create(newComment);
			// await saveComment.save()
			return newComment
		// } catch (error) {
		// 	console.log(error, 'error in create post');
		// 	return null;
		//   }
		
	  }
}