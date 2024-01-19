import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserViewType } from '../user.type';
import { UsersService } from '../user.service';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UsersRepository } from '../user.repository';
import { GenerateHashAdapter } from '../../adapter/generateHashAdapter';
import { EmailManager } from '../../manager/email.manager';
import { UserClass } from '../../../schema/user.schema';
import { InputDataReqClass } from '../../auth/auth.class';

export class RegistrationCommand {
  constructor(public inputDataReq: InputDataReqClass) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase implements ICommandHandler<RegistrationCommand> {
  constructor(
    protected readonly userService: UsersService,
    protected readonly usersRepository: UsersRepository,
    protected readonly emailManager: EmailManager,
	protected readonly generateHashAdapter: GenerateHashAdapter
  ) {}
  async execute(command: RegistrationCommand): Promise<UserViewType | null> {
    const passwordHash = await this.generateHashAdapter._generateHash(
      command.inputDataReq.password,
    );
    const newUser: UserClass = new UserClass(
      command.inputDataReq.login,
      command.inputDataReq.email,
      passwordHash,
      uuidv4(),
      add(new Date(), {
        hours: 1,
        minutes: 10,
      }),
      false,
    );
    const user: UserClass = await this.usersRepository.createUser(newUser);
    try {
      await this.emailManager.sendEamilConfirmationMessage(
        user.accountData.email,
        user.emailConfirmation.confirmationCode,
      );
    } catch (error) {
      console.log(error, 'error with send mail');
    }
    return user.getViewUser();
  }
}
