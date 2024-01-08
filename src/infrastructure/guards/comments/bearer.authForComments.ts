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
    protected userService: UsersService,
    protected jwtService: JwtService,
    protected deviceQueryRepository: DeviceQueryRepository,
    protected usersQueryRepository: UsersQueryRepository,
    protected usersRepository: UsersRepository,
    @InjectModel(IPCollectionClass.name)
    private ipCollectionModel: Model<IPCollectionDocument>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
	const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) throw new UnauthorizedException("401")

    const token = req.headers.authorization.split(' ')[1];
    const userId = await this.jwtService.verifyAsync(token, {secret: process.env.REFRESH_JWT_SECRET!});
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
