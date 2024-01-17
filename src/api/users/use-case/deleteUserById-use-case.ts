import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../user.repository';

export class DeleteUserById {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserById)
export class DeleteUserByIdCase implements ICommandHandler<DeleteUserById> {
  constructor(protected readonly usersRepository: UsersRepository) {}
  async execute(command: DeleteUserById): Promise<boolean> {
    const deleteId: boolean = await this.usersRepository.deleteById(
      command.userId,
    );
    return true;
  }
}
