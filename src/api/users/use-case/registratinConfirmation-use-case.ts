import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InputDateReqConfirmClass } from '../../auth/auth.class';
import { UsersQueryRepository } from '../users.queryRepository';
import { UsersRepository } from '../user.repository';

export class RegistrationConfirmation {
  constructor(public inputDateRegConfirm: InputDateReqConfirmClass) {}
}

@CommandHandler(RegistrationConfirmation)
export class RegistrationConfirmationCase
  implements ICommandHandler<RegistrationConfirmation>
{
  constructor(
    protected readonly usersQueryRepository: UsersQueryRepository,
    protected readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: RegistrationConfirmation) {
    const user = await this.usersQueryRepository.findUserByConfirmation(
      command.inputDateRegConfirm.code,
    );
    const result = await this.usersRepository.updateConfirmation(user!._id);
    return result;
  }
}
