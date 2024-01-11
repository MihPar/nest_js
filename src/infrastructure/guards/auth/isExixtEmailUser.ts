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
	console.log(email, " email")

    const user: UserClass | null =
      await this.usersQueryRepository.findByLoginOrEmail(email);
    if (!user) {
      throw new BadRequestException([
        { message: 'User does not exist in DB', field: 'email' }, 
      ]);
    } else if(user.emailConfirmation.isConfirmed === true) {
		throw new BadRequestException([
			{ message: 'Email is already exist in DB', field: 'email' },
		  ]);
	}
    return true;
  }
}
