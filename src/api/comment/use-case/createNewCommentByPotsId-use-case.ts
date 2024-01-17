import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserClass } from "../../../schema/user.schema";
import { InputModelClassPostId, InputModelContentePostClass } from "../../posts/posts.class";
import { CommentViewModel } from "../comment.type";
import { ObjectId } from "mongodb";
import { CommentRepository } from "../comment.repository";
import { LikeStatusEnum } from "../../likes/likes.emun";
import { CommentClass } from "../../../schema/comment.schema";

export class CreateNewCommentByPostId {
  constructor(
    public dto: InputModelClassPostId,
    public inputModelContent: InputModelContentePostClass,
    public user: UserClass,
    public userId: string | null,
  ) {}
}

@CommandHandler(CreateNewCommentByPostId)
export class CreateNewCommentByPostIdCase implements ICommandHandler<CreateNewCommentByPostId> {
	constructor(
		protected readonly commentRepository: CommentRepository
	) {}
	async execute(command: CreateNewCommentByPostId): Promise<CommentViewModel | null> {
			const userLogin = command.user.accountData.userName;
			if(!command.userId) return null
			const userId = command.userId
			const newComment: CommentClass = new CommentClass(command.inputModelContent.content, command.dto.postId, {userId, userLogin}) 
			const createNewCommentawait: CommentClass = await this.commentRepository.createNewCommentPostId(newComment);
			return createNewCommentawait.getNewComment(LikeStatusEnum.None)
	}
}