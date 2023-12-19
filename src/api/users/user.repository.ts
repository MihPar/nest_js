import { Injectable } from '@nestjs/common';
import { UsersModel } from 'src/db/db';
import { ObjectId } from 'mongodb';
import { Users } from './user.class';
import { add } from 'date-fns';

@Injectable()
export class UsersRepository {
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

  async passwordRecovery(id: ObjectId, recoveryCode: string): Promise<boolean> {
    const recoveryInfo = {
      ["emailConfirmation.confirmationCode"]: recoveryCode,
      ["emailConfirmation.expirationDate"]: add(new Date(), { minutes: 5 }),
    };
    const updateRes = await UsersModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: recoveryInfo }
    );
    return updateRes.matchedCount === 1;
  }

  async updatePassword(id: ObjectId, newPasswordHash: string) {
    const updatePassword = await UsersModel.updateOne(
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
    const result = await UsersModel.updateOne(
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
    const result = await UsersModel.updateOne(
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
}
