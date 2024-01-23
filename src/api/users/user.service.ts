import bcrypt from "bcrypt";
import { UsersRepository } from "./user.repository";
import { Injectable } from "@nestjs/common";
import { EmailManager } from "../manager/email.manager";
import { UsersQueryRepository } from "./users.queryRepository";
import { EmailAdapter } from "../../api/adapter/email.adapter";


@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailManager: EmailManager,
	protected emailAdapter: EmailAdapter,
	protected usersQueryRepository: UsersQueryRepository,
  ) {}
}