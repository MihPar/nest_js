import { ObjectId } from "mongodb";
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
  async createNewUser(
    login: string,
    password: string,
    email: string
  ): Promise<UserViewType | null> {
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
        user.emailConfirmation.confirmationCode
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
}