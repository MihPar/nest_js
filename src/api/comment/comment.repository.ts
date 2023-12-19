import { CommentsModel } from "src/db/db";
import { CommentsDB } from "./comment.class";
import { ObjectId } from "mongodb";

export class CommentRepository {
	async createNewCommentPostId(newComment: CommentsDB) {
		await CommentsModel.create(newComment);
		return newComment
	}

	async deleteAllComments() {
		const deletedAll = await CommentsModel.deleteMany({});
		return deletedAll.acknowledged;
	}

	async increase(commentId: string, likeStatus: string){
		if(likeStatus !== 'Dislike' && likeStatus !== 'Like') {
			return
		} 
		return await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: likeStatus === 'Dislike' ? {dislikesCount: 1} : {likesCount: 1}})
	}

	async decrease(commentId: string, likeStatus: string){
		if(likeStatus !== 'Dislike' && likeStatus !== 'Like') {
			return
		} 
		return await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: likeStatus === 'Dislike' ? {dislikesCount: -1} : {likesCount: -1}})
	}

	async updateComment(commentId: string, content: string) {
		const updateOne = await CommentsModel.updateOne(
		  { _id: new ObjectId(commentId) },
		  { $set: { content: content } }
		);
		return updateOne.matchedCount === 1;
	  }

	async deleteComment(commentId: string) {
		try {
			const deleteComment = await CommentsModel.deleteOne({
			  _id: new ObjectId(commentId),
			});
			return deleteComment.deletedCount === 1;
		  } catch (err) {
			return false; 
		  }
	}
}