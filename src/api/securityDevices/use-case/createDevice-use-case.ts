import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { DeviceClass } from "schema/device.schema";
import { DeviceService } from '../device.service';
import mongoose from 'mongoose';
import { DeviceRepository } from '../device.repository';
import { UserClass } from 'schema/user.schema';
import { randomUUID } from 'crypto';
import { PayloadAdapter } from 'api/adapter/payload.adapter';

export class CreateDevice {
	constructor(
		// public ip: string, 
		public IP: string, 
		// public title: any,
		public Headers: any,
		public user: UserClass
	) {}
}

@CommandHandler(CreateDevice)
export class CreateDeviceCase implements ICommandHandler<CreateDevice> {
	constructor(
		protected readonly deviceRepository: DeviceRepository,
		protected readonly jwtService: JwtService,
		protected readonly payloadAdapter: PayloadAdapter
	) {}
	async execute(
		command: CreateDevice
	  ): Promise<DeviceClass | null> {
		const token: string = await this.jwtService.signAsync({userId: command.user._id.toString()}, {expiresIn: "60s"});
		const refreshToken = await this.jwtService.signAsync({userId: command.user._id.toString(), deviceId: randomUUID()}, {expiresIn: "600s"});

		const ip = command.IP || "unknown";
		const title = command.Headers["user-agent"] || "unknown";

		
		const payload = await this.payloadAdapter.getPayload(refreshToken);
			if(!payload) throw new Error ('Can not decode token')
		const device  = new DeviceClass()
		// device.ip = command.ip
		device.ip = ip
		device._id = new mongoose.Types.ObjectId()
		device.deviceId = payload.deviceId
		device.lastActiveDate = new Date(payload.iat * 1000).toISOString()
		// device.title = command.title
		device.title = title
		device.userId = payload.userId
		
		const createDevice: DeviceClass = await this.deviceRepository.createDevice(device);
		return createDevice;
	  }
}