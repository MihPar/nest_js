import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UserClass, UserDocument } from '../../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { add } from 'date-fns';

@Injectable()
export class UsersRepository {
	constructor(
		@InjectModel(UserClass.name) private userModel: Model<UserDocument>
	) {}
  async createUser(newUser: UserClass) {
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
  async passwordRecovery(id: ObjectId, recoveryCode: string): Promise<boolean> {
    const recoveryInfo = {
      ["emailConfirmation.confirmationCode"]: recoveryCode,
      ["emailConfirmation.expirationDate"]: add(new Date(), { minutes: 5 }),
    };
    const updateRes = await this.userModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: recoveryInfo }
    );
    return updateRes.matchedCount === 1;
  }

  async updatePassword(id: ObjectId, newPasswordHash: string) {
    const updatePassword = await this.userModel.updateOne(
      { _id: id },
      {
        $unset: {
          "emailConfirmation.confirmationCode": 1,
          "emailConfirmation.expirationDate": 1,
        },
        $set: { "accountData.passwordHash": newPasswordHash },
      }
    );
    return updatePassword.matchedCount === 1;
  }

  async updateConfirmation(_id: ObjectId) {
    const result = await this.userModel.updateOne(
      { _id },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return result.matchedCount === 1;
  }

  async updateUserConfirmation(
    _id: ObjectId,
    confirmationCode: string,
    newExpirationDate: Date
  ): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { _id },
      {
        $set: {
          "emailConfirmation.confirmationCode": confirmationCode,
          "emailConfirmation.expirationDate": newExpirationDate,
        },
      }
    );
    return result.matchedCount === 1;
  }


  async findUserById(userId: ObjectId): Promise<UserClass | null> {
    let user: UserClass | null = await this.userModel.findOne({ _id: new ObjectId(userId) }).lean();
    return user;
  }
}
