import { Injectable } from "@nestjs/common";
import { DevicesModel } from "src/db/db";

@Injectable()
export class DeviceRepositories {
	async terminateSession(deviceId: string) {
		const deleteOne = await DevicesModel.deleteOne({deviceId});
		return deleteOne.deletedCount === 1;
	}

	async deleteAllDevices() {
		const deletedAll = await DevicesModel.deleteMany({})
		return deletedAll.acknowledged;
	}
}