import { Injectable } from "@nestjs/common";
import { Devices } from "./device.class";
import { DevicesModel } from "src/db/db";

@Injectable()
export class DeviceQueryRepository {
	async getAllDevicesUser(userId: string) {
		const getAllDevices: Devices[] = await DevicesModel
		  .find({ userId })
		  .lean();
		return getAllDevices.map(function (item) {
		  return {
			ip: item.ip,
			title: item.title,
			lastActiveDate: item.lastActiveDate,
			deviceId: item.deviceId,
		  };
		});
	}
}