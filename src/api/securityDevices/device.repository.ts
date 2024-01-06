import { Injectable } from '@nestjs/common';
import { Devices } from './device.class';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceClass, DeviceDocument } from 'schema/device.schema';

@Injectable()
export class DeviceRepository {
	constructor(
		@InjectModel(DeviceClass.name) private deviceModel: Model<DeviceDocument>
	) {}
  async terminateSession(deviceId: string) {
    const deletedOne = this.deviceModel.deleteOne({ deviceId });
    // return deletedOne.deletedCount === 1;
	return deletedOne.deleteOne()
  }

  async deleteAllDevices() {
    const deletedAll = this.deviceModel.deleteMany({});
    // return deletedAll.acknowledged;
	return deletedAll.deleteMany()
  }

  async createDevice(device: Devices): Promise<Devices> {
    const resultDevice = await this.deviceModel.insertMany(device);
    return device;
  }

  async updateDeviceUser(
    userId: string,
    deviceId: string,
    newLastActiveDate: string,
  ) {
    await this.deviceModel.updateOne(
      { userId, deviceId },
      { $set: { lastActiveDate: newLastActiveDate } },
    );
  }

  async logoutDevice(deviceId: string) {
	const decayResult = await this.deviceModel.deleteOne({deviceId})
	return decayResult.deletedCount === 1
  }

  async createCollectionIP(reqData: any) {
	await this.deviceModel.insertMany(reqData);
	return reqData;
  }


  async countDocs(filter: any) {
	const result = await this.deviceModel.countDocuments(filter);
	return result
  }
}
