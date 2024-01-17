import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../user.repository";

export class DeleteAllUsers {
	constructor() {}
}

@CommandHandler(DeleteAllUsers)
export class DeleteAllUsersCase implements ICommandHandler<DeleteAllUsers> {
	constructor(
		protected readonly usersRepository: UsersRepository
	) {}
 	async execute(command: DeleteAllUsers): Promise<any> {
		return await this.usersRepository.deleteAll();
	}
}