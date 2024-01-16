import { Req, Res, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { UserClass } from "schema/user.schema";

export class RefreshToken {
	constructor(
		public refreshToken: string,
		public user: UserClass,
	) {}
}

@CommandHandler(RefreshToken)
export class RefreshTokenCase implements ICommandHandler<RefreshToken> {
	constructor(
		protected readonly jwtService: JwtService
	) {}
	async execute(
		command: RefreshToken,
		) {
		const payload = await this.jwtService.decode(command.refreshToken);
		if (!payload) {
		  throw new UnauthorizedException("Not authorization 401")
		}
		const newToken: string = await this.jwtService.signAsync(command.user);
		const newRefreshToken: string = await this.jwtService.signAsync(
			{payload: command.user._id.toString()},
		  	payload.deviceId
		);
		const result = { newToken, newRefreshToken }
		return result
		// return newToken
	}
	
}
