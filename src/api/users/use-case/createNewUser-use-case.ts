import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserViewType } from '../user.type';
import { GenerateHashAdapter } from '../../adapter/generateHashAdapter';
import { InputModelClassCreateBody } from '../user.class';
import { UserClass } from '../../../schema/user.schema';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../user.repository';
import { EmailManager } from '../../manager/email.manager';

export class CreateNewUser {
  constructor(public body: InputModelClassCreateBody) {}
}

@CommandHandler(CreateNewUser)
export class CreateNewUserCase implements ICommandHandler<CreateNewUser> {
  constructor(
    protected readonly generateHashAdapter: GenerateHashAdapter,
    protected readonly usersRepository: UsersRepository,
    protected readonly emailManager: EmailManager,
  ) {}
  async execute(command: CreateNewUser): Promise<UserViewType | null> {
    const passwordHash = await this.generateHashAdapter._generateHash(
      command.body.password,
    );
    const newUser = new UserClass(
      command.body.login,
      command.body.email,
      passwordHash,
      uuidv4(),
      add(new Date(), { hours: 1, minutes: 10 }),
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
