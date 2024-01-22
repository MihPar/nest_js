import dotenv from 'dotenv';
dotenv.config();
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../../api/users/user.service';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { IPCollectionClass, IPCollectionDocument } from '../../../schema/IP.Schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class Ratelimits implements CanActivate {
  constructor(
    protected userService: UsersService,
    @InjectModel(IPCollectionClass.name)
    private ipCollectionModel: Model<IPCollectionDocument>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    console.log(req.headers.authorization);
    console.log(this.userService);
    const reqData: IPCollectionClass = {
      _id: new ObjectId(),
      IP: req.ip || '',
      URL: req.originalUrl,
      date: new Date(),
    };
    await this.ipCollectionModel.create(reqData);
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const filter = {
      $and: [
        { IP: reqData.IP },
        { URL: reqData.URL },
        { date: { $gte: tenSecondsAgo } },
      ],
    };

    const count = await this.ipCollectionModel.countDocuments(filter);
    if (count > 5) {
      throw new HttpException(
        'More than 5 attempts from one IP-address during 10 seconds',
        429,
      );
    }
    return true;
  }
}
