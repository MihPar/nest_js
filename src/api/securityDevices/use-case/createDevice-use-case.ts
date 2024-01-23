import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import mongoose from 'mongoose';
import { DeviceRepository } from '../device.repository';
import { UserClass } from '../../../schema/user.schema';
import { randomUUID } from 'crypto';
import { PayloadAdapter } from '../../../api/adapter/payload.adapter';
import { DeviceClass } from '../../../schema/device.schema';

export class CreateDeviceCommand {
	constructor(
		public IP: string, 
		public Headers: any,
		public user: UserClass
	) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase implements ICommandHandler<CreateDeviceCommand> {
	constructor(
		protected readonly deviceRepository: DeviceRepository,
		protected readonly jwtService: JwtService,
		protected readonly payloadAdapter: PayloadAdapter
	) {}
	async execute(
		command: CreateDeviceCommand
	  ): Promise<{refreshToken: string, token: string} | null> {
		const deviceId  = randomUUID()
		const token: string = await this.jwtService.signAsync({userId: command.user._id.toString()}, {expiresIn: "600s"});
		const refreshToken = await this.jwtService.signAsync({userId: command.user._id.toString(), deviceId}, {expiresIn: "600s"});

		const ip = command.IP || "unknown";
		const title = command.Headers["user-agent"] || "unknown";

		const device  = new DeviceClass()
		device.ip = ip
		device._id = new mongoose.Types.ObjectId()
		device.deviceId = deviceId
		device.lastActiveDate = new Date().toISOString()
		device.title = title
		device.userId = command.user._id.toString()
		
		const createdDeviceId: string | null = await this.deviceRepository.createDevice(device);

		if(!createdDeviceId){
			return null
		}
		return {
			refreshToken,
			token
		};
	  }
}