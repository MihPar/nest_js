import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { UserClass } from "../../../schema/user.schema";
import { PayloadAdapter } from "../../adapter/payload.adapter";

export class RefreshTokenCommand {
	constructor(
		public refreshToken: string,
		public user: UserClass,
	) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<RefreshTokenCommand> {
	constructor(
		protected readonly jwtService: JwtService,
		protected readonly payloadAdapter: PayloadAdapter
	) {}
	async execute(
		command: RefreshTokenCommand,
		) {
		const payload = await this.payloadAdapter.getPayload(command.refreshToken);
		if(!payload) throw new UnauthorizedException("Not authorization 401")
		const newToken: string = await this.jwtService.signAsync(command.user);
		const newRefreshToken: string = await this.jwtService.signAsync(
			{userId: command.user._id.toString(), deviceId:	payload.deviceId},
		);
		const result = { newToken, newRefreshToken }
		return result
	}
	
}
