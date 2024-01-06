import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Ip,
  PayloadTooLargeException,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../api/users/user.service';
import { ObjectId } from 'mongodb';
import { CollectionIP } from 'api/adapter/CollectionIP/collection.class';
import { Model } from 'mongoose';
import { IPCollectionClass, IPCollectionDocument } from 'schema/IP.Schema';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceRepository } from 'api/securityDevices/device.repository';

@Injectable()
export class RatelimitsRegistration implements CanActivate {
  constructor(
    protected userService: UsersService,
    protected deviceRepository: DeviceRepository,
    @InjectModel(IPCollectionClass.name)
    private ipCollectionModel: Model<IPCollectionDocument>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const reqData: CollectionIP = {
      _id: new ObjectId(),
      IP: req.ip,
      URL: req.originalUrl,
      date: new Date(),
    };
    await this.deviceRepository.createCollectionIP(reqData);
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const filter = {
      IP: reqData.IP,
      URL: reqData.URL,
      date: { $gt: tenSecondsAgo },
    };

    const count = await this.deviceRepository.countDocs(filter);
	if (count > 5) {
		throw new HttpException(
		  'More than 5 attempts from one IP-address during 10 seconds',
		  429,
		);
	  }
	  return true;
  }
}
