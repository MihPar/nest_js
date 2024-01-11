import { Model } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { DeviceClass, DeviceDocument } from "../../schema/device.schema";
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DeviceQueryRepository {
	constructor(
		@InjectModel(DeviceClass.name) private deviceModel: Model<DeviceDocument>
	) {}
	async getAllDevicesUser(userId: string) {
		const getAllDevices: DeviceClass[] = await this.deviceModel
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

	async findDeviceByDeviceId(deviceId: string) {
		return await this.deviceModel.findOne({ deviceId: deviceId }).lean();
	  }
}