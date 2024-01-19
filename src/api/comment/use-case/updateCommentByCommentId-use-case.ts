import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InputModelContent, inputModelCommentId } from "../comment.class-pipe"
import { CommentRepository } from "../comment.repository";

export class UpdateCommentByCommentIdCommand {
	constructor(
		public id: inputModelCommentId, 
		public dto: InputModelContent,
	) {}
}

@CommandHandler(UpdateCommentByCommentIdCommand)
export class UpdateCommentByCommentIdUseCase implements ICommandHandler<UpdateCommentByCommentIdCommand> {
	constructor(
		protected readonly commentRepository: CommentRepository
	) {}
	async execute(command: UpdateCommentByCommentIdCommand): Promise<boolean> {
		const updateCommentId = await this.commentRepository.updateComment(
			command.id.commentId,
			command.dto.content
		  );
		  return updateCommentId;
	}
}





    