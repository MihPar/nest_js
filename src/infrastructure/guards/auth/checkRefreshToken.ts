import jwt  from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { DeviceQueryRepository } from '../../../api/securityDevices/deviceQuery.repository';
import { UsersQueryRepository } from '../../../api/users/users.queryRepository';
import { ApiJwtService } from '../../../api/jwt/jwt.service';

@Injectable()
export class CheckRefreshToken implements CanActivate {
	constructor(
		protected jwtService: JwtService,
		protected deviceQueryRepository: DeviceQueryRepository,
		protected usersQueryRepository: UsersQueryRepository,
		protected apiJwtService: ApiJwtService
	) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {

	// console.log('refresh token')
	const req: Request = context.switchToHttp().getRequest();
	// console.log("req: ", req.cookies.refreshToken)

	const refreshToken = req.cookies.refreshToken;
	// console.log("refreshToken: ", refreshToken)
	if (!refreshToken) throw new UnauthorizedException("401")
	let result: any;
	try {
		result = await this.jwtService.verify(refreshToken, {secret: process.env.REFRESH_JWT_SECRET!});
	} catch (err) { 
		throw new UnauthorizedException("401")
	}
	// console.log("result: ", result)
	const session = await this.deviceQueryRepository.findDeviceByDeviceId(
	  result.deviceId
	);
	// console.log("session: ", session)
	const payload = await this.jwtService.decode(refreshToken);
	// console.log("payload: ", payload)

	// if (
	//   !session ||
	//   session.lastActiveDate !==
	// 	// (new Date(payload.iat * 1000).toISOString())
	// 	(await this.apiJwtService.getLastActiveDate(refreshToken))
	// ) {
	// 	throw new UnauthorizedException("401")
	// }
	console.log("payload: ", payload)

	if (result.userId) {
	  const user = await this.usersQueryRepository.findUserById(result.userId)
	  if (!user) {
		throw new UnauthorizedException("401")
	  }
	  console.log("user: ", user)
	  req['user'] = user;
	  return true
	}
	throw new UnauthorizedException("401")
  }
}