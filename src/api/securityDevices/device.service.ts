import { DeviceQueryRepository } from './deviceQuery.repository';
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DeviceRepository } from './device.repository';
import { DeviceClass } from 'schema/device.schema';
import mongoose from 'mongoose';

@Injectable()
export class DeviceService {
	constructor(
		protected deviceQueryRepository: DeviceQueryRepository,
		protected deviceRepository: DeviceRepository,
		protected jwtService: JwtService
	) {}
	async terminateAllCurrentSessions(userId: string, deviceId: string) {
		const findSession =
      await this.deviceQueryRepository.getAllDevicesUser(userId);
    if (!findSession) {
      return false;
    }
    for (let session of findSession) {
      if (session.deviceId !== deviceId) {
        await this.deviceRepository.terminateSession(
          session.deviceId
        );
      }
    }
    return true;
	}

	async deleteAllDevices() {
		return await this.deviceRepository.deleteAllDevices()
	}

	async createDevice(
		ip: string,
		title: string,
		refreshToken: string
	  ): Promise<DeviceClass | null> {
		let payload

		try {
			payload = await this.jwtService.decode(refreshToken);
		} catch(error) {
			return null
		}
		console.log('payload', payload)
		const device  = new DeviceClass()
		device.ip = ip
		device._id = new mongoose.Types.ObjectId()
		device.deviceId = payload.deviceId
		device.lastActiveDate = new Date(payload.iat * 1000).toISOString()
		device.title = title
		device.userId = payload.userId
		
		const createDevice: DeviceClass =
		  await this.deviceRepository.createDevice(device);
		return createDevice;
	  }

	  async updateDevice(userId: string, refreshToken: string) {
		const payload = await this.jwtService.decode(refreshToken);
		if (!payload) {
		  return null;
		}
		await this.deviceRepository.updateDeviceUser(
		  userId,
		  payload.deviceId,
		  new Date(payload.iat * 1000).toISOString()
		);
		return;
	  }

	  async logoutDevice(refreshToken: string) {
		const payload = await this.jwtService.decode(refreshToken);
		if (!payload) {
		  return null;
		}
		const logoutDevice = await this.deviceRepository.logoutDevice(
		  payload.deviceId
		);
		if (!logoutDevice) {
		  return null;
		}
		return true;
	  }
}