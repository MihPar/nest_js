import { ObjectId, WithId } from "mongodb";
import { UserViewType} from "./user.type";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid"
import { UsersRepository } from "./user.repository";
import { Injectable } from "@nestjs/common";
import { add } from "date-fns";
import { EmailManager } from "src/api/manager/email.manager";
import { Users } from "./user.class";
import { UsersQueryRepository } from "./users.queryRepository";

@Injectable()
export class UserService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailManager: EmailManager,
	protected usersQueryRepository: UsersQueryRepository
  ) {}
  async createNewUser(login: string, password: string, email: string) {
    const passwordHash = await this._generateHash(password);
    const newUser: Users = {
      _id: new ObjectId(),
      accountData: {
        userName: login,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 10,
        }),
        isConfirmed: false,
      },
      getViewUser(): UserViewType {
        return {
          id: this._id.toString(),
          login: this.accountData.userName,
          email: this.accountData.email,
          createdAt: this.accountData.createdAt,
        };
      },
    };
    const user: Users = await this.usersRepository.createUser(newUser);
    try {
      await this.emailManager.sendEamilConfirmationMessage(
        user.accountData.email,
        user.emailConfirmation.confirmationCode,
      );
    } catch (error) {
      console.log(error);
    }
    return {
      id: user._id.toString(),
      login: user.accountData.userName,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
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

  async recoveryPassword(email: string): Promise<any> {
    const recoveryCode = uuidv4();
    const findUser: WithId<Users> | null =
      await this.usersQueryRepository.findUserByEmail(email);
    // console.log("findUser: ", findUser);
    if (!findUser) {
    //   console.log("false: ", findUser);
      return false;
    }
    try {
      await this.emailManager.sendEamilRecoveryCode(email, recoveryCode);
      await this.usersRepository.passwordRecovery(findUser._id, recoveryCode);
	  return true
    //   return recoveryCode;
    } catch (e) {
      console.log("email: ", e);
      return false;
    }
  }

  async setNewPassword(
    newPassword: string,
    recoveryCode: string
  ): Promise<boolean> {
    const findUserByCode = await this.usersQueryRepository.findUserByCode(
      recoveryCode
    );
    if (!findUserByCode) {
      return false;
    }
    if (findUserByCode.emailConfirmation.expirationDate < new Date()) {
      return false;
    }
    const newPasswordHash = await this._generateHash(newPassword);
    const resultUpdatePassword = await this.usersRepository.updatePassword(
      findUserByCode._id,
      newPasswordHash
    );
    if (!resultUpdatePassword) {
      return false;
    }
    return true;
  }

  async checkCridential(
    loginOrEmail: string,
    password: string
  ): Promise<Users | null> {
    const user: Users | null =
      await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;
    const resultBcryptCompare: boolean = await bcrypt.compare(
      password,
      user.accountData.passwordHash
    );
    if (resultBcryptCompare !== true) return null;
    return user;
  }

  async findUserByConfirmationCode(code: string): Promise<boolean> {
    const user = await this.usersQueryRepository.findUserByConfirmation(code);
    const result = await this.usersRepository.updateConfirmation(user!._id);
    return result;
  }

  async confirmEmailResendCode(email: string): Promise<boolean | null> {
    const user: Users | null =
      await this.usersQueryRepository.findByLoginOrEmail(email);
    if (!user) return null;
    if (user.emailConfirmation.isConfirmed) {
      return null;
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
      return null;
    }
    return true;
  }
}