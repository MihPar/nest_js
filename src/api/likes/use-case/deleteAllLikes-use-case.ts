import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikesRepository } from "../likes.repository";

export class DeleteAllLikes {
	constructor() {}
}

@CommandHandler(DeleteAllLikes)
export class DeleteAllLikesCase implements ICommandHandler<DeleteAllLikes> {
	constructor(
		protected readonly likesRepository: LikesRepository
	) {}
 	async execute(command: DeleteAllLikes): Promise<any> {
		return await this.likesRepository.deleteLikes()
	}
}