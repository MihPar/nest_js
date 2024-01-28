import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { UserClass } from "../../../schema/user.schema";
import { PayloadAdapter } from "../../adapter/payload.adapter";
import { ApiJwtService } from "../../jwt/jwt.service";

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
		protected readonly payloadAdapter: PayloadAdapter,
		protected readonly apiJwtService: ApiJwtService,
	) {}
	async execute(
		command: RefreshTokenCommand,
		) {
		const payload = await this.payloadAdapter.getPayload(command.refreshToken);
		if(!payload) throw new UnauthorizedException("Not authorization 401")
		// const newToken: string = await this.jwtService.signAsync(command.user,  {secret: process.env.JWT_SECRET!, expiresIn: '10s'});
		// const newRefreshToken: string = await this.jwtService.signAsync(
		// 	{userId: command.user._id.toString(), deviceId:	payload.deviceId},
		// 	{secret: process.env.REFRESH_JWT_SECRET, expiresIn: '20s'}
		// );

		const {accessToken: newToken, refreshToken: newRefreshToken} = await this.apiJwtService.createJWT(command.user._id.toString(), payload.deviceId)

		// console.log(newToken)
		// console.log(newRefreshToken)
		
		const result = { newToken, newRefreshToken }
		return result
	}
	
}
