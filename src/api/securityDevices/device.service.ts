import { Injectable } from "@nestjs/common";
import { deviceQueryRepository } from "./deviceQuery.repository";
import { DeviceRepositories } from "./device.repository";

@Injectable()
export class DeviceService {
	constructor(
		protected deviceQueryRepository: deviceQueryRepository,
		protected deviceRepositories: DeviceRepositories
	) {}
	async terminateAllCurrentSessions(userId: string, deviceId: string) {
		const findSession =
      await this.deviceQueryRepository.getAllDevicesUser(userId);
    if (!findSession) {
      return false;
    }
    for (let session of findSession) {
      if (session.deviceId !== deviceId) {
        await this.deviceRepositories.terminateSession(
          session.deviceId
        );
      }
    }
    return true;
	}

	async deleteAllDevices() {
		return await this.deviceRepositories.deleteAllDevices()
	}
}