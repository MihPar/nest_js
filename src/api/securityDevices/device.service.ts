// import { Injectable } from "@nestjs/common";
// import { deviceQueryRepository } from "./deviceQuery.repository";
// import { DeviceRepositories } from "./device.repository";
// import { Devices } from "./device.class";
// import { JWTService } from "../jwt/jwt.service";
// import { ObjectId } from "mongodb";

// @Injectable()
// export class DeviceService {
// 	constructor(
// 		protected deviceQueryRepository: deviceQueryRepository,
// 		protected deviceRepositories: DeviceRepositories,
// 		protected jwtService: JWTService
// 	) {}
// 	async terminateAllCurrentSessions(userId: string, deviceId: string) {
// 		const findSession =
//       await this.deviceQueryRepository.getAllDevicesUser(userId);
//     if (!findSession) {
//       return false;
//     }
//     for (let session of findSession) {
//       if (session.deviceId !== deviceId) {
//         await this.deviceRepositories.terminateSession(
//           session.deviceId
//         );
//       }
//     }
//     return true;
// 	}

// 	async deleteAllDevices() {
// 		return await this.deviceRepositories.deleteAllDevices()
// 	}

// 	async createDevice(
// 		ip: string,
// 		title: string,
// 		refreshToken: string
// 	  ): Promise<Devices | null> {
// 		const payload = await this.jwtService.decodeRefreshToken(refreshToken);
// 		if (!payload) {
// 		  return null;
// 		}
// 		const lastActiveDate = this.jwtService.getLastActiveDate(refreshToken);
// 		const device: Devices = {
// 		  _id: new ObjectId(),
// 		  ip: ip,
// 		  title: title,
// 		  deviceId: payload.deviceId,
// 		  userId: payload.userId,
// 		  lastActiveDate: lastActiveDate,
// 		};
	
// 		const createDevice: Devices =
// 		  await this.deviceRepositories.createDevice(device);
// 		return createDevice;
// 	  }

// 	  async updateDevice(userId: string, refreshToken: string) {
// 		const payload = await this.jwtService.decodeRefreshToken(refreshToken);
	
// 		if (!payload) {
// 		  return null;
// 		}
// 		const lastActiveDate = this.jwtService.getLastActiveDate(refreshToken);
// 		await this.deviceRepositories.updateDeviceUser(
// 		  userId,
// 		  payload.deviceId,
// 		  lastActiveDate
// 		);
// 		return;
// 	  }

// 	  async logoutDevice(refreshToken: string) {
// 		const payload = await this.jwtService.decodeRefreshToken(refreshToken);
// 		if (!payload) {
// 		  return null;
// 		}
// 		const logoutDevice = await this.deviceRepositories.logoutDevice(
// 		  payload.deviceId
// 		);
// 		if (!logoutDevice) {
// 		  return null;
// 		}
// 		return true;
// 	  }
// }