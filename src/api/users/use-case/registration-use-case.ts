import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InputDataReqClass } from "api/auth/auth.class";
import { UserViewType } from "../user.type";
import { UsersService } from "../user.service";
import { UserClass } from "schema/user.schema";
import {v4 as uuidv4} from "uuid"
import { add } from "date-fns";
import { UsersRepository } from "../user.repository";
import { EmailManager } from "api/manager/email.manager";

export class Registration {
	constructor(
		public inputDataReq: InputDataReqClass
	) {}
}

@CommandHandler(Registration)
export class RegistrationCase implements ICommandHandler<Registration> {
	constructor(
		protected readonly userService: UsersService,
		protected readonly usersRepository: UsersRepository,
		protected readonly emailManager: EmailManager
	) {}
	async execute(
		command: Registration
	): Promise<UserViewType | null> {
		const passwordHash = await this.userService._generateHash(command.inputDataReq.password);

		const newUser: UserClass = new UserClass(
			command.inputDataReq.login, 
			command.inputDataReq.email, 
			passwordHash, 
			uuidv4(), 
			add(new Date(), {
			hours: 1,
			minutes: 10,
		  }), 
		  false
		  )
	
		const user: UserClass = await this.usersRepository.createUser(newUser);
		try {
		  await this.emailManager.sendEamilConfirmationMessage(
			user.accountData.email,
			user.emailConfirmation.confirmationCode
		  );
		} catch (error) {
		  console.log(error, 'error with send mail');
		}
		return user.getViewUser()
	}
}



    