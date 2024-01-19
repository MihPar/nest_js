import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../../api/users/user.service';
import { Model } from 'mongoose';
import { IPCollectionClass, IPCollectionDocument } from '../../../schema/IP.Schema';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceQueryRepository } from '../../../api/securityDevices/deviceQuery.repository';
import { UsersQueryRepository } from '../../../api/users/users.queryRepository';
import { UsersRepository } from '../../../api/users/user.repository';

@Injectable()
export class CheckRefreshTokenForComments implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
	const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) throw new UnauthorizedException("401")

    const token = req.headers.authorization.split(' ')[1];
    // const userId = await this.jwtService.verifyAsync(token, {secret: process.env.REFRESH_JWT_SECRET!});
	let userId
	try {
		userId = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET!})
	} catch(error) {
		throw new UnauthorizedException("401")
	}
    if (userId) {
      const user = await this.usersQueryRepository.findUserById(userId);
      if (user) {
        req['user'] = user;
        return true
      }
      throw new UnauthorizedException("401")
    } else {
      throw new UnauthorizedException("401")
    }
  }
}
