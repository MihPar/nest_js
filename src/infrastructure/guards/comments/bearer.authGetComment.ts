import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Ip,
  PayloadTooLargeException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../../api/users/user.service';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { IPCollectionClass, IPCollectionDocument } from 'schema/IP.Schema';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceQueryRepository } from 'api/securityDevices/deviceQuery.repository';
import { UsersQueryRepository } from 'api/users/users.queryRepository';
import { UsersRepository } from 'api/users/user.repository';
import { Users } from 'api/users/user.class';

@Injectable()
export class CheckRefreshTokenForGetComments implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected usersQueryRepository: UsersQueryRepository,
    
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) throw new UnauthorizedException('401');
    const token = req.headers.authorization.split(' ')[1];
    const userId = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET!,
    });
    if (userId) {
      const resultAuth = await this.usersQueryRepository.findUserById(userId);
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
