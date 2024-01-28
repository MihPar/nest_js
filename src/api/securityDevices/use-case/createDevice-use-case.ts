import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import mongoose from 'mongoose';
import { DeviceRepository } from '../device.repository';
import { UserClass } from '../../../schema/user.schema';
import { randomUUID } from 'crypto';
import { PayloadAdapter } from '../../../api/adapter/payload.adapter';
import { DeviceClass } from '../../../schema/device.schema';
import { ApiJwtService } from '../../jwt/jwt.service';

export class CreateDeviceCommand {
	constructor(
		public IP: string, 
		public deviceName: string,
		public user: UserClass,
	) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase implements ICommandHandler<CreateDeviceCommand> {
	constructor(
		protected readonly deviceRepository: DeviceRepository,
		protected readonly jwtService: JwtService,
		protected readonly payloadAdapter: PayloadAdapter,
		protected readonly apiJwtService: ApiJwtService,

	) {}
	async execute(
		command: CreateDeviceCommand
	  ): Promise<{refreshToken: string, token: string} | null> {
		try {
			const deviceId  = randomUUID()
			// const accessToken: string = await this.jwtService.signAsync({userId: command.user._id.toString()}, { secret: process.env.JWT_SECRET, expiresIn: '10s' });

			// const refreshToken = await this.jwtService.signAsync({userId: command.user._id.toString(), deviceId}, { secret: process.env.REFRESH_JWT_SECRET, expiresIn: '20s' });
	
			const {accessToken, refreshToken} = await this.apiJwtService.createJWT(command.user._id.toString(), deviceId)
			const payload = await this.jwtService.decode(refreshToken);
			const date = payload.iat * 1000
			// console.log("catch: ")
			const ip = command.IP || "unknown";
			// const title = command.Headers["user-agent"] || "unknown";
	
			const device  = new DeviceClass()
			device.ip = ip
			device._id = new mongoose.Types.ObjectId()
			device.deviceId = deviceId
			device.lastActiveDate = new Date(date).toISOString()
			device.title = command.deviceName
			device.userId = command.user._id.toString()
			
			const createdDeviceId: string | null = await this.deviceRepository.createDevice(device);
	
			if(!createdDeviceId){
				return null
			}
			return {
				refreshToken,
				token: accessToken
			};
		} catch(error) {
			console.log("WIOERUWEFJSDKFJSDFSDIFSFISFISEISEF: ", error)
		}
		return null
	  }
}