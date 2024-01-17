import { Controller, Delete, Get, HttpCode, NotFoundException, Param, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { DeviceQueryRepository } from "./deviceQuery.repository";
import { DeviceService } from './device.service';
import { DeviceRepository } from './device.repository';
import { JwtService } from "@nestjs/jwt";
import { UserDecorator, UserIdDecorator } from "../../infrastructure/decorator/decorator.user";
import { Request } from "express";
import { CheckRefreshToken } from "../../infrastructure/guards/auth/checkRefreshToken";
import { ForbiddenCalss } from "../../infrastructure/guards/securityDevice.ts/forbidden";
import { UserClass } from "../../schema/user.schema";
import { CommandBus } from "@nestjs/cqrs";
import { TerminateAllCurrentSession } from "./use-case/terminateAllCurrentSeccion-use-case";
import { PayloadAdapter } from "../adapter/payload.adapter";

@Controller('security')
export class SecurityDeviceController {
  constructor(
    protected deviceQueryRepository: DeviceQueryRepository,
    protected deviceRepository: DeviceRepository,
	protected commandBus: CommandBus,
	protected payloadAdapter: PayloadAdapter
  ) {}
  @Get('/devices')
  @HttpCode(200)
  @UseGuards(CheckRefreshToken)
  async getDevicesUser(
    @UserDecorator() user: UserClass,
    @UserIdDecorator() userId: string | null,
  ) {
    if (!userId) return null;
    return await this.deviceQueryRepository.getAllDevicesUser(userId);
  }

  @Delete('/devices')
  @UseGuards(CheckRefreshToken)
  @HttpCode(204)
  async terminateCurrentSession(
    @UserDecorator() user: UserClass,
    @UserIdDecorator() userId: string | null,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    if (!userId) return null;
    const refreshToken = req.cookies.refreshToken;
    const payload = await this.payloadAdapter.getPayload(refreshToken);
    if (!payload) throw new UnauthorizedException('401');
    if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(payload.deviceId))
      throw new NotFoundException('404');
	  const findAllCurrentDevices =
      await this.commandBus.execute(new TerminateAllCurrentSession(userId, payload.deviceId))
    // const findAllCurrentDevices =
    //   await this.deviceService.terminateAllCurrentSessions(
    //     userId,
    //     payload.deviceId,
    //   );
    if (!findAllCurrentDevices) throw new UnauthorizedException('401');
  }

  @Delete('/devices/:deviceId')
  @HttpCode(204)
  @UseGuards(CheckRefreshToken)
  @UseGuards(ForbiddenCalss)
  async terminateSessionById(@Param('deviceId') deviceId: string) {
	const deleteDeviceById = await this.deviceRepository.terminateSession(deviceId);
	if (!deleteDeviceById) throw new NotFoundException("404")
  }
}