import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { DeviceQueryRepository } from '../../../api/securityDevices/deviceQuery.repository';
import { UsersQueryRepository } from '../../../api/users/users.queryRepository';

@Injectable()
export class CheckRefreshToken implements CanActivate {
	constructor(
		protected jwtService: JwtService,
		protected deviceQueryRepository: DeviceQueryRepository,
		protected usersQueryRepository: UsersQueryRepository,
	) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {

	console.log('refresh token')
	const req: Request = context.switchToHttp().getRequest();
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) throw new UnauthorizedException("401")
	let result: any;
	try {
		result = await this.jwtService.verify(refreshToken, {secret: process.env.REFRESH_JWT_SECRET!});
	} catch (err) { 
		throw new UnauthorizedException("401")
	}
	const session = await this.deviceQueryRepository.findDeviceByDeviceId(
	  result.deviceId
	);
	const payload = await this.jwtService.decode(refreshToken);
	if (
	  !session ||
	  session.lastActiveDate !==
		(new Date(payload.iat * 1000).toISOString())
	) {
		throw new UnauthorizedException("401")
	}
	if (result.userId) {
	  const user = await this.usersQueryRepository.findUserById(new ObjectId(result.userId));
	  if (!user) {
		throw new UnauthorizedException("401")
	  }
	  req['user'] = user;
	  return true
	}
	throw new UnauthorizedException("401")
  }
}