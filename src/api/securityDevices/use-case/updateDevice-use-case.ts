import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { DeviceService } from "../device.service";
import { DeviceRepository } from "../device.repository";

export class UpdateDevice {
	constructor(
		public userId: string | null,
		public newRefreshToken: string
	) {}
}

@CommandHandler(UpdateDevice)
export class UpdateDeviceCase implements ICommandHandler<UpdateDevice> {
	constructor(
		protected jwtService: JwtService,
		protected deviceService: DeviceService,
		protected deviceRepository: DeviceRepository
	) {}
	async execute(
		command: UpdateDevice
	) {
		let payload
		try {
			payload = await this.deviceService.getPayload(command.newRefreshToken);
		} catch(error) {
			return null
		}
			if(!command.userId) return false
			await this.deviceRepository.updateDeviceUser(
				command.userId,
			  payload.deviceId,
			  new Date(payload.iat * 1000).toISOString()
			);
			return;
	}
}