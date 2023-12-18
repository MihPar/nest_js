import { CommentsModel } from "src/db/db";
import { CommentsDB } from "./comment.class";

export class CommentRepositories {
	async createNewCommentPostId(newComment: CommentsDB) {
		await CommentsModel.create(newComment);
		return newComment
	}
}