import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { UsersQueryRepository } from "../../../api/users/users.queryRepository";
import { Request } from "express";
import { UserClass } from "../../../schema/user.schema";

export class GetUserIdByTokenCommand {
	constructor(
		public req: Request
	) {}
}

@CommandHandler(GetUserIdByTokenCommand)
export class GetUserIdByTokenUseCase implements ICommandHandler<GetUserIdByTokenCommand> {
	constructor(
		protected readonly jwtService: JwtService,
		protected readonly usersQueryRepository:  UsersQueryRepository
	) {}
	async execute(command: GetUserIdByTokenCommand): Promise<UserClass> {
	const token: string = command.req.headers.authorization!.split(" ")[1];
	const userId = await this.jwtService.verifyAsync(token);
	if (!userId) throw new UnauthorizedException('Not authorization 401')
	const currentUser: UserClass | null = await this.usersQueryRepository.findUserById(userId)
	if (!currentUser) throw new UnauthorizedException('Not authorization 401')
	return currentUser
	}
}