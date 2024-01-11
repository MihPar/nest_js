import {
	Injectable,
	CanActivate,
	ExecutionContext,
	HttpStatus,
	HttpException,
	BadRequestException,
  } from '@nestjs/common';
import { UserClass } from '../../../schema/user.schema';
import { UsersQueryRepository } from '../../../api/users/users.queryRepository';
import { ValidationError } from 'class-validator';
import e from 'express';
  
  @Injectable()
  export class CheckLoginOrEmail implements CanActivate {
    constructor(
		private readonly usersQueryRepository: UsersQueryRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest()
		const login = req.body.login
		const email = req.body.email

	console.log(login, email, 'email login')

		const userByLogin: UserClass | null = await this.usersQueryRepository.findByLoginOrEmail(login)
		const userByEmail: UserClass | null = await this.usersQueryRepository.findByLoginOrEmail(email)

		if(userByLogin) {
			throw new BadRequestException([{message: 'Incorrect login!', field: 'login'}])
		}

		if(userByEmail){
			throw new BadRequestException([{message: 'Incorrect email!', field: 'email'}])
		}

		return true
  	}
}