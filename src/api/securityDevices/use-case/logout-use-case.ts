import { HttpException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PayloadAdapter } from "../../../api/adapter/payload.adapter";
import { DeviceRepository } from "../device.repository";

	export class Logout {
		constructor(
			public refreshToken: string
		) {}
	}
	
	@CommandHandler(Logout)
  export class LogoutCase implements ICommandHandler<Logout> {
    constructor(
		protected readonly payloadAdapter: PayloadAdapter,
		protected readonly deviceRepository: DeviceRepository
	) {}
    async execute(command: Logout): Promise<boolean> {
      const payload = await this.payloadAdapter.getPayload(command.refreshToken);
      if (!payload) throw new HttpException( 'Can not be payload', 400)
      const logoutDevice = await this.deviceRepository.logoutDevice(
        payload.deviceId,
      );
      if (!logoutDevice) throw new HttpException( 'Can not be logoutDevice', 400)
      return true;
    }
  }