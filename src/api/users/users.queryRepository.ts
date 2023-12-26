import { Injectable } from '@nestjs/common';
import { UserViewType} from './user.type';
import { Users } from './user.class';
import { InjectModel } from '@nestjs/mongoose';
import { UserClass, UserDocument } from '../../schema/user.schema';
import { Model } from 'mongoose';
import { PaginationType } from '../../types/pagination.types';

@Injectable()
export class UsersQueryRepository {
	constructor(
		@InjectModel(UserClass.name) private userModel: Model<UserDocument>
	) {}
	async getAllUsers(
		sortBy: string,
		sortDirection: string,
		pageNumber: string,
		pageSize: string,
		searchLoginTerm: string,
		searchEmailTerm: string
	  ): Promise<PaginationType<UserViewType>> {
		const filter = {
			$or: [
				{"accountData.userName": {$regex: searchLoginTerm || "",$options: "i"}},
				{"accountData.email": { $regex: searchEmailTerm ?? "", $options: "i" }}
			],
		};
	
		const getAllUsers: Users[] = await this.userModel.find(filter, {__v: 0})
		  .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
		  .skip((+pageNumber - 1) * +pageSize)
		  .limit(+pageSize)
		  .lean()
	
		const totalCount: number = await this.userModel.countDocuments(filter);
		const pagesCount: number = await Math.ceil(totalCount / +pageSize);
		return {
		  pagesCount: pagesCount,
		  page: +pageNumber,
		  pageSize: +pageSize,
		  totalCount: totalCount,
		  items: getAllUsers.map((user: Users): UserViewType => ({
				id: user._id.toString(),
				login: user.accountData.userName,
				email: user.accountData.email,
				createdAt: user.accountData.createdAt,
			})),
		};
	  }
}
