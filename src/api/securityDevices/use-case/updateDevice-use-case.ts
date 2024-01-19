import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { DeviceService } from '../device.service';
import { DeviceRepository } from '../device.repository';
import { HttpException } from '@nestjs/common';
import { PayloadAdapter } from '../../../api/adapter/payload.adapter';

export class UpdateDeviceCommand {
  constructor(public userId: string | null, public newRefreshToken: string) {}
}

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceUseCase implements ICommandHandler<UpdateDeviceCommand> {
  constructor(
    protected jwtService: JwtService,
    protected deviceService: DeviceService,
    protected deviceRepository: DeviceRepository,
    protected readonly payloadAdapter: PayloadAdapter,
  ) {}
  async execute(command: UpdateDeviceCommand) {
    const payload = await this.payloadAdapter.getPayload(
      command.newRefreshToken,
    );
    if (!payload) throw new HttpException('Can not be payload', 400);
    if (!command.userId) return false;
    await this.deviceRepository.updateDeviceUser(
      command.userId,
      payload.deviceId,
      new Date(payload.iat * 1000).toISOString(),
    );
    return;
  }
}
