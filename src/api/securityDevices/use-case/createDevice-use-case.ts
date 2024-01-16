import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { DeviceClass } from "schema/device.schema";
import { DeviceService } from '../device.service';
import mongoose from 'mongoose';
import { DeviceRepository } from '../device.repository';

export class CreateDevice {
	constructor(
		public ip: string, 
		public title: any,
		public refreshToken: string
	) {}
}

@CommandHandler(CreateDevice)
export class CreateDeviceCase implements ICommandHandler<CreateDevice> {
	constructor(
		protected readonly deviceService: DeviceService,
		protected readonly deviceRepository: DeviceRepository
	) {}
	async execute(
		command: CreateDevice
	  ): Promise<DeviceClass | null> {
		let payload
		try {
			payload = await this.deviceService.getPayload(command.refreshToken);
		} catch(error) {
			return null
		}
		const device  = new DeviceClass()
		device.ip = command.ip
		device._id = new mongoose.Types.ObjectId()
		device.deviceId = payload.deviceId
		device.lastActiveDate = new Date(payload.iat * 1000).toISOString()
		device.title = command.title
		device.userId = payload.userId
		
		const createDevice: DeviceClass = await this.deviceRepository.createDevice(device);
		return createDevice;
	  }
}



