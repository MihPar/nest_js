import { Injectable } from '@nestjs/common';
import { DevicesModel } from 'src/db/db';
import { Devices } from './device.class';

@Injectable()
export class DeviceRepositories {
  async terminateSession(deviceId: string) {
    const deleteOne = await DevicesModel.deleteOne({ deviceId });
    return deleteOne.deletedCount === 1;
  }

  async deleteAllDevices() {
    const deletedAll = await DevicesModel.deleteMany({});
    return deletedAll.acknowledged;
  }

  async createDevice(device: Devices): Promise<Devices> {
    const resultDevice = await DevicesModel.insertMany(device);
    return device;
  }

  async updateDeviceUser(
    userId: string,
    deviceId: string,
    newLastActiveDate: string,
  ) {
    await DevicesModel.updateOne(
      { userId, deviceId },
      { $set: { lastActiveDate: newLastActiveDate } },
    );
  }

  async logoutDevice(deviceId: string) {
	const decayResult = await DevicesModel.deleteOne({deviceId})
	return decayResult.deletedCount === 1
  }
}
