import { DeviceQueryRepository } from './deviceQuery.repository';
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DeviceRepository } from './device.repository';

@Injectable()
export class DeviceService {
  constructor(
    protected deviceQueryRepository: DeviceQueryRepository,
    protected deviceRepository: DeviceRepository,
    protected jwtService: JwtService,
  ) {}

  async deleteAllDevices() {
    return await this.deviceRepository.deleteAllDevices();
  }
}