import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EmailManager } from "api/manager/email.manager";
import { UsersRepository } from "api/users/user.repository";
import { UsersQueryRepository } from "api/users/users.queryRepository";
import { WithId } from "mongodb";
import { UserClass } from "schema/user.schema";
import {v4 as uuidv4} from "uuid"


export class RecoveryPasswordCommand {
	constructor(
		public email: string,
	) {}
  }

  @CommandHandler(RecoveryPasswordCommand)
  export class RecoveryPasswordUseCase implements ICommandHandler<RecoveryPasswordCommand> {
	constructor(
		private usersQueryRepository: UsersQueryRepository,
		private emailManager: EmailManager,
		private usersRepository: UsersRepository
	) {}
	async execute(
		command: RecoveryPasswordCommand
	) {
		const recoveryCode = uuidv4();
		const findUser: WithId<UserClass | null> | null =
		  await this.usersQueryRepository.findUserByEmail(command.email);
		if (!findUser) {
		  return false;
		}
		try {
		  await this.emailManager.sendEamilRecoveryCode(command.email, recoveryCode);
		  await this.usersRepository.passwordRecovery(findUser._id, recoveryCode);
		  return true
		} catch (e) {
		  return false;
		}
	}
  }