import { Injectable } from '@nestjs/common';
import { UsersModel } from 'src/db/db';
import { ObjectId } from 'mongodb';
import { Users } from './user.class';

@Injectable()
export class UserRepository {
  async createUser(newUser: Users) {
    const updateUser = await UsersModel.insertMany([newUser]);
    return newUser;
  }

  async deleteById(userId: string) {
	const deleted = await UsersModel.deleteOne({ _id: new ObjectId(userId) });
    return deleted.deletedCount === 1;
  }

  async deleteAll() {
	const deleteAllUsers = await UsersModel.deleteMany({});
    return deleteAllUsers.deletedCount === 1;
  }
}
