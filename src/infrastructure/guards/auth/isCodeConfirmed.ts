import {
	Injectable,
	CanActivate,
	ExecutionContext,
  } from '@nestjs/common';
  import { UserClass } from '../../../schema/user.schema';
  import { UsersQueryRepository } from '../../../api/users/users.queryRepository';
  
  @Injectable()
  export class IsConfirmed implements CanActivate {
	constructor(private readonly usersQueryRepository: UsersQueryRepository) {}
  
	async canActivate(context: ExecutionContext): Promise<boolean> {
	  const req = context.switchToHttp().getRequest();
	  const code = req.body.code;
  
	  const user: UserClass | null = await this.usersQueryRepository.findUserByConfirmation(code)
	console.log(user)
	if(!user) {
		throw new Error('User not found')
	} 
    if(user.emailConfirmation.expirationDate <= new Date()) {
		throw new Error('code was expiration')
	} 
	if(user.emailConfirmation.isConfirmed) {
		throw new Error('Code is alreade confirmed')
	}
	req.user = user
	return true
	}
  }
  