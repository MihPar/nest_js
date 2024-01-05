import { Injectable, CanActivate, ExecutionContext, Ip, PayloadTooLargeException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../../api/users/user.service';
import { ObjectId } from 'mongodb';
import { CollectionIP } from 'api/adapter/CollectionIP/collection.class';
import { Model } from 'mongoose';
import { IPCollectionClass, IPCollectionDocument } from 'schema/IP.Schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class Ratelimits implements CanActivate {
	constructor(
		protected userService: UsersService,
		@InjectModel(IPCollectionClass.name) private ipCollectionModel: Model<IPCollectionDocument>
	) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const req: Request = context.switchToHttp().getRequest();
	console.log(req.headers.authorization)
	console.log(this.userService)
	const reqData: CollectionIP = {
		_id: new ObjectId(),
		IP: req.ip,
		URL: req.originalUrl,
		date: new Date(),
	}
	await this.ipCollectionModel.create(reqData)
    const tenSecondsAgo = new Date(Date.now() - 10000)
    const filter = {$and: [{IP: reqData.IP}, {URL: reqData.URL}, {date: {$gte: tenSecondsAgo}}]}

    const count = await this.ipCollectionModel.countDocuments(filter)
    if (count > 5) {
		throw new PayloadTooLargeException("More than 5 attempts from one IP-address during 10 seconds")
    } 
    return true
  }
}