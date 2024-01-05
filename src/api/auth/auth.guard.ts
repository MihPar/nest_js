import { Injectable, CanActivate, ExecutionContext, Ip, PayloadTooLargeException } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { Observable } from 'rxjs';
import { UsersService } from '../users/user.service';
import { ObjectId } from 'mongodb';
import { CollectionIP } from 'api/adapter/CollectionIP/collection.class';
import { Model } from 'mongoose';
import { IPCollectionClass, IPCollectionDocument } from 'schema/IP.Schema';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		protected userService: UsersService,
		@Injectable(IPCollectionClass.name) private ipCollectionModel: Model<IPCollectionDocument>
	) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
	console.log(request.headers.authorization)
	console.log(this.userService)
	// throw new UnauthorizedException()
    return true
  }
  async limitRequestMiddlewarePassword(req: Request, res: Response, next: NextFunction, @Ip() IP: string) {
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
	next()
}
}