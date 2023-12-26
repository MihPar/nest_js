import { CommentClass, CommentDocument } from "../../schema/comment.schema";
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