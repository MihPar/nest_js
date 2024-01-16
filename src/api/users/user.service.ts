import { WithId } from "mongodb";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid"
import { UsersRepository } from "./user.repository";
import { Injectable } from "@nestjs/common";
import { add } from "date-fns";
import { EmailManager } from "../manager/email.manager";
import { UsersQueryRepository } from "./users.queryRepository";
import { EmailAdapter } from "../../api/adapter/email.adapter";
import { UserClass } from "../../schema/user.schema";
import { UserViewType } from "./user.type";

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailManager: EmailManager,
	protected emailAdapter: EmailAdapter,
	protected usersQueryRepository: UsersQueryRepository,
  ) {}

//   async checkCridential(
//     loginOrEmail: string,
//     password: string
//   ): Promise<UserClass | null> {
//     const user: UserClass | null =
//       await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
//     if (!user) return null;
//     const resultBcryptCompare: boolean = await bcrypt.compare(
//       password,
//       user.accountData.passwordHash
//     );
//     if (resultBcryptCompare !== true) return null;
//     return user;
//   }

  async createNewUser(
    login: string,
    password: string,
    email: string
  ): Promise<UserViewType | null> {
    const passwordHash = await this._generateHash(password);

	const newUser = new UserClass(login, email, passwordHash, uuidv4(), add(new Date(), {
		hours: 1,
		minutes: 10,
	  }), false)

    const user: UserClass = await this.usersRepository.createUser(newUser);
    try {
      await this.emailManager.sendEamilConfirmationMessage(
        user.accountData.email,
        user.emailConfirmation.confirmationCode
      );
    } catch (error) {
      console.log(error, 'error with send mail');
    }
	return user.getViewUser()
  }

  async _generateHash(password: string): Promise<string> {
    const hash: string = await bcrypt.hash(password, 3);
    return hash;
  }

  async deleteUserById(userId: string) {
    const deleteId: boolean = await this.usersRepository.deleteById(userId);
    return deleteId;
  }

  async deleteAllUsers() {
	return await this.usersRepository.deleteAll();
  }


//   async recoveryPassword(email: string): Promise<any> {
//     const recoveryCode = uuidv4();
//     const findUser: WithId<UserClass | null> | null =
//       await this.usersQueryRepository.findUserByEmail(email);
//     if (!findUser) {
//       return false;
//     }
//     try {
//       await this.emailManager.sendEamilRecoveryCode(email, recoveryCode);
//       await this.usersRepository.passwordRecovery(findUser._id, recoveryCode);
// 	  return true
//     } catch (e) {
//       return false;
//     }
//   }

//   async setNewPassword(
//     newPassword: string,
//     recoveryCode: string
//   ): Promise<boolean> {
//     const findUserByCode = await this.usersQueryRepository.findUserByCode(
//       recoveryCode
//     );
//     if (!findUserByCode) {
//       return false;
//     }
//     if (findUserByCode.emailConfirmation.expirationDate < new Date()) {
//       return false;
//     }
//     const newPasswordHash = await this._generateHash(newPassword);
//     const resultUpdatePassword = await this.usersRepository.updatePassword(
//       findUserByCode._id,
//       newPasswordHash
//     );
//     if (!resultUpdatePassword) {
//       return false;
//     }
//     return true;
//   }

  async findUserByConfirmationCode(code: string): Promise<boolean> {
    const user = await this.usersQueryRepository.findUserByConfirmation(code);
    const result = await this.usersRepository.updateConfirmation(user!._id);
    return result;
  }

  async confirmEmailResendCode(email: string): Promise<boolean | null> {
    const user: UserClass | null =
      await this.usersQueryRepository.findByLoginOrEmail(email);
    if (!user) return false
    if (user.emailConfirmation.isConfirmed) {
      return false
    }
    const newConfirmationCode = uuidv4();
    const newExpirationDate = add(new Date(), {
      hours: 1,
      minutes: 10,
    });
    await this.usersRepository.updateUserConfirmation(
      user!._id,
      newConfirmationCode,
      newExpirationDate
    );
    try {
      await this.emailManager.sendEamilConfirmationMessage(
        user.accountData.email,
        newConfirmationCode
      );
    } catch (error) {
		console.log("code resending email error", error);
    }
    return true;
  }
}