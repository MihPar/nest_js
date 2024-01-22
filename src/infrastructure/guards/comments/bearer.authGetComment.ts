import dotenv from 'dotenv';
dotenv.config();
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../../../api/users/users.queryRepository';

@Injectable()
export class CheckRefreshTokenForGet implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected usersQueryRepository: UsersQueryRepository,
    
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
	// console.log("req.headers.authorization: ", req.headers.authorization)
    // if (!req.headers.authorization) throw new UnauthorizedException('401');
	let payload
	let token = req.headers.authorization
	if (!token) {
			req.user = null 
			return true
		} try {
		payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET!})
		const resultAuth = await this.usersQueryRepository.findUserById(payload.userId);
		req['user'] = resultAuth;
        return true;
	} catch(error) {
		console.log(error)
		return true
	}
	
	// let token
	// let payload
	// if (!req.headers.authorization) {
	// 	req.user = null
	// } else {
	// 	token = req.headers.authorization.split(' ')[1];
	// 	payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET!})
	// }
    // if (payload) {
    //   const resultAuth = await this.usersQueryRepository.findUserById(payload.userId);
    //   if (resultAuth) {
    //     req['user'] = resultAuth;
    //     return true;
    //   }
    //   return true;
    // } else {
    //   return true;
    // }
  }
}