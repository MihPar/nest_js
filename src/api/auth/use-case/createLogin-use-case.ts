import bcrypt  from 'bcrypt';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InputDataModelClassAuth } from "../auth.class";
import { UserClass } from "schema/user.schema";
import { UsersService } from "api/users/user.service";
import { UsersQueryRepository } from "api/users/users.queryRepository";

export class CreateLogin {
	constructor(
		public inutDataModel: InputDataModelClassAuth,
	) {}
}

@CommandHandler(CreateLogin)
export class CreateLoginCase implements ICommandHandler<CreateLogin> {
	constructor(
		protected readonly userService: UsersService,
		protected readonly usersQueryRepository: UsersQueryRepository
	) {}
	async execute(
		command: CreateLogin
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


