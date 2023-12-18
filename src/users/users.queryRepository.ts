import { Injectable } from '@nestjs/common';
import { UsersModel } from 'src/db/db';
import { UserViewType} from './user.type';
import { Users } from './user.class';

@Injectable()
export class UsersQueryRepository {
  constructor() {}

  async getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
    searchLoginTerm: string,
    searchEmailTerm: string,
  ) {
	const filter = {
		$or: [
		  {
			"accountData.userName": {
			  $regex: searchLoginTerm || "",
			  $options: "i",
			},
		  },
		  {
			"accountData.email": { $regex: searchEmailTerm ?? "", $options: "i" },
		  },
		],
	  };
	  const getAllUsers = await UsersModel.find(filter, {__v: 0}
	  )
		.sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
		.skip((+pageNumber - 1) * +pageSize)
		.limit(+pageSize)
		.lean()
	  const totalCount: number = await UsersModel.countDocuments(filter);
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
