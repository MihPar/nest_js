import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { UsersRepository } from '../../../api/users/user.repository';
import { UserClass } from 'schema/user.schema';

@Injectable()
export class CheckRefreshTokenFindMe implements CanActivate {
	constructor(
		protected jwtService: JwtService,
		protected usersRepository: UsersRepository,
	) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
	const req: Request = context.switchToHttp().getRequest();
	if (!req.headers.authorization) throw new UnauthorizedException("401")

	  const token: string = req.headers.authorization!.split(" ")[1];

	  const userId: ObjectId = await this.jwtService.verifyAsync(token, {secret: process.env.REFRESH_JWT_SECRET!});
	  if (!userId) throw new UnauthorizedException("401")
	  const currentUser: UserClass | null = await this.usersRepository.findUserById(userId);
	  if (!currentUser) throw new UnauthorizedException("401")
	  return true
}
}