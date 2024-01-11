import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { UserClass } from '../../../schema/user.schema';
import { UsersQueryRepository } from '../../../api/users/users.queryRepository';

@Injectable()
export class IsExistEmailUser implements CanActivate {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const email = req.body.email;

    const user: UserClass | null =
      await this.usersQueryRepository.findByLoginOrEmail(email);
    if (!user) {
      throw new BadRequestException([
        { message: 'Incorrect email!', field: 'email' },
      ]);
    }
    return true;
  }
}
