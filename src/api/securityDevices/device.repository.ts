import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceClass, DeviceDocument } from '../../schema/device.schema';
import { CollectionIP } from 'api/CollectionIP/collection.class';
import { IPCollectionClass, IPCollectionDocument } from 'schema/IP.Schema';

@Injectable()
export class DeviceRepository {
	constructor(
		@InjectModel(DeviceClass.name) private deviceModel: Model<DeviceDocument>,
		@InjectModel(IPCollectionClass.name) private collectioinIPModel: Model<IPCollectionDocument>
	) {}
  async terminateSession(deviceId: string) {
    const deletedOne = this.deviceModel.deleteOne({ deviceId });
	return deletedOne.deleteOne()
  }

  async deleteAllDevices() {
    const deletedAll = this.deviceModel.deleteMany({});
    // return deletedAll.acknowledged;
	return deletedAll.deleteMany()
  }

  async createDevice(device: DeviceClass): Promise<DeviceClass> {
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

  async createCollectionIP(reqData: CollectionIP) {
	await this.collectioinIPModel.insertMany(reqData);
	return reqData;
  }


  async countDocs(filter: any) {
	const result = await this.collectioinIPModel.countDocuments(filter);
	return result
  }
}
