import {
	Injectable,
	CanActivate,
	ExecutionContext,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { Model } from 'mongoose';
  import { IPCollectionDocument } from '../../../schema/IP.Schema';
  import { InjectModel } from '@nestjs/mongoose';
import { UserClass } from '../../../schema/user.schema';
import { UsersQueryRepository } from '../../../api/users/users.queryRepository';
  
  @Injectable()
  export class CheckLoginOrEmail implements CanActivate {
    constructor(
		protected usersQueryRepository: UsersQueryRepository,
      @InjectModel(UserClass.name)
      private userModel: Model<IPCollectionDocument>,
    ) {}
    async canActivate(context: ExecutionContext): Promise<any> {
      const req: Request = context.switchToHttp().getRequest();
	  async(loginOrEmail) => {
		const user: UserClass | null = await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail)
		if(user) {
			throw new Error('Login does not exist in DB')
		}
		return true
    }
  }
}