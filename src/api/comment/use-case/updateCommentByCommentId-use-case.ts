import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InputModelContent, inputModelCommentId } from "../comment.class-pipe"
import { CommentRepository } from "../comment.repository";

export class UpdateCommentByCommentId {
	constructor(
		public id: inputModelCommentId, 
		public dto: InputModelContent,
	) {}
}

@CommandHandler(UpdateCommentByCommentId)
export class UpdateCommentByCommentIdCase implements ICommandHandler<UpdateCommentByCommentId> {
	constructor(
		protected readonly commentRepository: CommentRepository
	) {}
	async execute(command: UpdateCommentByCommentId): Promise<boolean> {
		const updateCommentId = await this.commentRepository.updateComment(
			command.id.commentId,
			command.dto.content
		  );
		  return updateCommentId;
	}
}





    