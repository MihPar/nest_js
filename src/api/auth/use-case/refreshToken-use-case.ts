import { Req, Res, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { DeviceService } from "api/securityDevices/device.service";
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
		protected readonly jwtService: JwtService,
		protected readonly deviceService: DeviceService
	) {}
	async execute(
		command: RefreshToken,
		) {
		let payload
		try {
			payload = await this.deviceService.getPayload(command.refreshToken);
		} catch(error) {
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
