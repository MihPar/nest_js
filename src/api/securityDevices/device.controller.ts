import { Controller, Delete, Get, Param, Req, Res } from "@nestjs/common";
import { DeviceQueryRepository } from "./deviceQuery.repository";
import { DeviceService } from './device.service';
import { DeviceRepository } from './device.repository';
import { JwtService } from "@nestjs/jwt";
import { UserDecorator, UserIdDecorator } from "infrastructure/decorator/decorator.user";
import { Users } from "api/users/user.class";

@Controller('api')
export class SecurityDevice {
	constructor(
		protected deviceQueryRepository: DeviceQueryRepository,
		protected jwtService: JwtService,
		protected deviceService: DeviceService,
		protected deviceRepository: DeviceRepository 
	) {}
	@Get('security/devices')
	async getDevicesUser(
		@UserDecorator() user: Users,
		@UserIdDecorator() userId: string | null,
	) {
		// const userId = req.user._id.toString();
		if(!userId) return null
		return await this.deviceQueryRepository.getAllDevicesUser(userId)
	}

	@Delete('security/devices')
	async terminateCurrentSession(
		@UserDecorator() user: Users,
		@UserIdDecorator() userId: string | null,
		@Res({passthrough: true}) res: Response,
		@Req() req: Request
	) {
		if(!userId) return null
		// const userId = req.user._id.toString();
		const refreshToken = req.cookie.refreshToken;
    	const payload = await this.jwtService.decode(refreshToken);
		const findAllCurrentDevices =
			await this.deviceService.terminateAllCurrentSessions(userId, payload.deviceId);
	}

	@Delete("security/devices/:deviceId")
	async terminateSessionById(@Param("deviceId") deviceId: string) {
		await this.deviceRepository.terminateSession(deviceId);
	}
}