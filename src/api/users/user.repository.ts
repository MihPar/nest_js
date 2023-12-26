import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Users } from './user.class';
import { add } from 'date-fns';
import { UserClass, UserDocument } from '../../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
	constructor(
		@InjectModel(UserClass.name) private userModel: Model<UserDocument>
	) {}
  async createUser(newUser: Users) {
    const updateUser = await this.userModel.insertMany([newUser]);
    return newUser;
  }

  async deleteById(userId: string) {
	const deleted = await this.userModel.deleteOne({ _id: new ObjectId(userId) });
    return deleted.deletedCount === 1;
  }

  async deleteAll() {
	const deleteAllUsers = await this.userModel.deleteMany({});
    return deleteAllUsers.deletedCount === 1;
  }
}
