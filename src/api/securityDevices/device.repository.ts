// import { Injectable } from '@nestjs/common';
// import { Devices } from './device.class';
// import { Model } from 'mongoose';
// import { DeviceClass, DeviceDocument } from 'src/schema/device.schema';
// import { InjectModel } from '@nestjs/mongoose';

// @Injectable()
// export class DeviceRepositories {
// 	constructor(
// 		@InjectModel(DeviceClass.name) private deviceModel: Model<DeviceDocument>
// 	) {}
//   async terminateSession(deviceId: string) {
//     const deletedOne = this.deviceModel.deleteOne({ deviceId });
//     // return deletedOne.deletedCount === 1;
// 	return deletedOne.deleteOne()
//   }

//   async deleteAllDevices() {
//     const deletedAll = this.deviceModel.deleteMany({});
//     // return deletedAll.acknowledged;
// 	return deletedAll.deleteMany()
//   }

//   async createDevice(device: Devices): Promise<Devices> {
//     const resultDevice = await DevicesModel.insertMany(device);
//     return device;
//   }

//   async updateDeviceUser(
//     userId: string,
//     deviceId: string,
//     newLastActiveDate: string,
//   ) {
//     await DevicesModel.updateOne(
//       { userId, deviceId },
//       { $set: { lastActiveDate: newLastActiveDate } },
//     );
//   }

//   async logoutDevice(deviceId: string) {
// 	const decayResult = await DevicesModel.deleteOne({deviceId})
// 	return decayResult.deletedCount === 1
//   }
// }
