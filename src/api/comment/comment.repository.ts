import { CommentsDB } from "./comment.class";
import { ObjectId } from "mongodb";
import { CommentClass, CommentDocument } from "src/schema/comment.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

export class CommentRepository {
	constructor(
		@InjectModel(CommentClass.name) private commentModel: Model<CommentDocument>
	) {}

	async deleteAllComments() {
		const deletedAll = await this.commentModel.deleteMany({});
		return deletedAll.deletedCount === 1;
	}
}