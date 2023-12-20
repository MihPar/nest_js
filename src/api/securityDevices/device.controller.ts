import { JWTService } from '../jwt/jwt.service';
import { Controller, Delete, Get, Param } from "@nestjs/common";
import { deviceQueryRepository } from "./deviceQuery.repository";
import { DeviceService } from './device.service';
import { DeviceRepositories } from './device.repository';

@Controller('api')
export class SecurityDevice {
	constructor(
		protected deviceQueryRepository: deviceQueryRepository,
		protected jwtService: JWTService,
		protected deviceService: DeviceService,
		protected deviceRepositories: DeviceRepositories
	) {}
	@Get('security/devices')
	async getDevicesUser() {
		const userId = req.user._id.toString();
		return await this.deviceQueryRepository.getAllDevicesUser(userId)
	}

	@Delete('security/devices')
	async terminateCurrentSession() {
		const userId = req.user._id.toString();
		const refreshToken = req.cookies.refreshToken;
    	const payload = await this.jwtService.decodeRefreshToken(refreshToken);
		const findAllCurrentDevices =
			await this.deviceService.terminateAllCurrentSessions(userId, payload.deviceId);
	}

	@Delete("security/devices/:deviceId")
	async terminateSessionById(@Param("deviceId") deviceId: string) {
		await this.deviceRepositories.terminateSession(deviceId);
	}
}