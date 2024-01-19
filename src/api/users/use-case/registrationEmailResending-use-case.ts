import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../users.queryRepository';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UsersRepository } from '../user.repository';
import { emailInputDataClass } from '../../auth/auth.class';
import { EmailManager } from '../../manager/email.manager';
import { UserClass } from '../../../schema/user.schema';

export class RegistrationEmailResendingCommand {
  constructor(public inputDateReqEmailResending: emailInputDataClass) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase
  implements ICommandHandler<RegistrationEmailResendingCommand>
{
  constructor(
    protected readonly usersQueryRepository: UsersQueryRepository,
    protected readonly usersRepository: UsersRepository,
    protected readonly emailManager: EmailManager,
  ) {}
  async execute(command: RegistrationEmailResendingCommand): Promise<any> {
    const user: UserClass | null =
      await this.usersQueryRepository.findByLoginOrEmail(
        command.inputDateReqEmailResending.email,
      );
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) {
      return false;
    }
    const newConfirmationCode = uuidv4();
    const newExpirationDate = add(new Date(), {
      hours: 1,
      minutes: 10,
    });
    await this.usersRepository.updateUserConfirmation(
      user!._id,
      newConfirmationCode,
      newExpirationDate,
    );
    try {
      await this.emailManager.sendEamilConfirmationMessage(
        user.accountData.email,
        newConfirmationCode,
      );
    } catch (error) {
      console.log('code resending email error', error);
    }
    return true;
  }
}
