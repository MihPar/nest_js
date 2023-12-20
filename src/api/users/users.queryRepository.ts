import { Injectable } from '@nestjs/common';
import { UsersModel } from 'src/db/db';
import { UserViewType} from './user.type';
import { Users } from './user.class';
import { ObjectId, WithId } from 'mongodb';

@Injectable()
export class UsersQueryRepository {
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

  async findUserByEmail(email: string) {
    return UsersModel.findOne({ "accountData.email": email }, {__v: 0}).lean();
  }

  async findUserByCode(recoveryCode: string): Promise<WithId<Users> | null> {
    return UsersModel.findOne({
      "emailConfirmation.confirmationCode": recoveryCode,
    }, {__v: 0}).lean();
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<Users | null> {
    const user: Users | null = await UsersModel.findOne({
      $or: [
        { "accountData.email": loginOrEmail },
        { "accountData.userName": loginOrEmail },
      ],
    }, {__v: 0}).lean(); 
    return user;
  }

  async findUserByConfirmation(code: string): Promise<Users | null> {
    const user: Users | null = await UsersModel.findOne({
      "emailConfirmation.confirmationCode": code,
    }, {__v: 0}).lean();
    return user;
  }

  async findUserById(userId: ObjectId): Promise<Users | null> {
    let user = await UsersModel.findOne({ _id: new ObjectId(userId) }, {__v: 0}).lean();
    return user;
  }
}
