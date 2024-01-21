import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
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
    if (!req.headers.authorization) throw new UnauthorizedException('401');
    const token = req.headers.authorization.split(' ')[1];
    // const userId = await this.jwtService.verifyAsync(token, {
    //   secret: process.env.JWT_SECRET!,
    // });
	let payload
	try {
		payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET!})
	} catch(error) {
		throw new UnauthorizedException("401")
	}
	console.log("userId: ", payload)
    if (payload) {
      const resultAuth = await this.usersQueryRepository.findUserById(payload.userId);
      if (resultAuth) {
        req['user'] = resultAuth;
        return true;
      }
      return true;
    } else {
      return true;
    }
  }
}
