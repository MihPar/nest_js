import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InputModelNewPasswordClass } from "../../auth/auth.class";
import { UsersQueryRepository } from "api/users/users.queryRepository";
import { UsersService } from "api/users/user.service";
import { UsersRepository } from "api/users/user.repository";

export class NewPassword {
	constructor(
	public inputDataNewPassword: InputModelNewPasswordClass,
	) {}
}

@CommandHandler(NewPassword)
export class NewPasswordCase implements ICommandHandler<NewPassword> {
	constructor(
		protected readonly usersQueryRepository: UsersQueryRepository,
		protected readonly userSevice: UsersService,
		protected readonly usersRepository: UsersRepository
	) {}
	async execute (
		command: NewPassword
	  ): Promise<boolean> {
		const findUserByCode = await this.usersQueryRepository.findUserByCode(
			command.inputDataNewPassword.recoveryCode
		);
		if (!findUserByCode) {
		  return false;
		}
		if (findUserByCode.emailConfirmation.expirationDate < new Date()) {
		  return false;
		}
		const newPasswordHash = await this.userSevice._generateHash(command.inputDataNewPassword.newPassword);
		const resultUpdatePassword = await this.usersRepository.updatePassword(
		  findUserByCode._id,
		  newPasswordHash
		);
		if (!resultUpdatePassword) {
		  return false;
		}
		return true;
	  }
}