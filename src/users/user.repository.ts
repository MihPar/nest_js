import { Injectable } from '@nestjs/common';
import { Users } from './user.type';
import { UsersModel } from 'src/db/db';
import { ObjectId } from 'mongodb';

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
}
