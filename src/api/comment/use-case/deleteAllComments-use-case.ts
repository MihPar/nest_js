import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentRepository } from "../comment.repository";

export class DeleteAllComments {
	constructor() {}
}

@CommandHandler(DeleteAllComments)
export class DeleteAllCommentsCase implements ICommandHandler<DeleteAllComments> {
	constructor(
		protected readonly commentRepository: CommentRepository
	) {}
 	async execute(command: DeleteAllComments): Promise<any> {
		return await this.commentRepository.deleteAllComments();
	}
}