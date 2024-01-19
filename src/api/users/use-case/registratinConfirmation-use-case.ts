import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InputDateReqConfirmClass } from '../../auth/auth.class';
import { UsersQueryRepository } from '../users.queryRepository';
import { UsersRepository } from '../user.repository';

export class RegistrationConfirmationCommand {
  constructor(public inputDateRegConfirm: InputDateReqConfirmClass) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(
    protected readonly usersQueryRepository: UsersQueryRepository,
    protected readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: RegistrationConfirmationCommand) {
    const user = await this.usersQueryRepository.findUserByConfirmation(
      command.inputDateRegConfirm.code,
    );
    const result = await this.usersRepository.updateConfirmation(user!._id);
    return result;
  }
}
