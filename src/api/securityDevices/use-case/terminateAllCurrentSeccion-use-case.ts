import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeviceQueryRepository } from "../deviceQuery.repository";
import { HttpException } from "@nestjs/common";
import { DeviceRepository } from "../device.repository";

export class TerminateAllCurrentSession {
	constructor(
		public userId: string | null,
		public deviceId: string
	) {}
}

@CommandHandler(TerminateAllCurrentSession)
export class TerminateAllCurrentSessionCase implements ICommandHandler<TerminateAllCurrentSession> {
	constructor(
		protected readonly deviceQueryRepository: DeviceQueryRepository,
		protected readonly deviceRepository: DeviceRepository
	) {}
	async execute(command: TerminateAllCurrentSession): Promise<any> {
		if(!command.userId) throw new HttpException('Bad request', 400)
			const findSession = await this.deviceQueryRepository.getAllDevicesUser(
				command.userId,
			);
			if (!findSession) {
			  return false;
			}
			for (let session of findSession) {
			  if (session.deviceId !== command.deviceId) {
				await this.deviceRepository.terminateSession(session.deviceId);
			  }
			}
			return true;
	}
}