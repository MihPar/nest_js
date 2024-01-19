import bcrypt  from 'bcrypt';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InputDataModelClassAuth } from "../../auth/auth.class";
import { UserClass } from "../../../schema/user.schema";
import { UsersService } from "../../../api/users/user.service";
import { UsersQueryRepository } from "../../../api/users/users.queryRepository";

export class CreateLoginCommand {
	constructor(
		public inutDataModel: InputDataModelClassAuth,
	) {}
}

@CommandHandler(CreateLoginCommand)
export class CreateLoginUseCase implements ICommandHandler<CreateLoginCommand> {
	constructor(
		protected readonly userService: UsersService,
		protected readonly usersQueryRepository: UsersQueryRepository
	) {}
	async execute(
		command: CreateLoginCommand
	  ): Promise<UserClass | null> {
		const user: UserClass | null =
		  await this.usersQueryRepository.findByLoginOrEmail(command.inutDataModel.loginOrEmail);
		if (!user) return null;
		const resultBcryptCompare: boolean = await bcrypt.compare(
			command.inutDataModel.password,
			user.accountData.passwordHash
		);
		if (resultBcryptCompare !== true) return null;
		return user;
	  }
}


