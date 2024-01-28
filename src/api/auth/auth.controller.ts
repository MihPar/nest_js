import { DeviceService } from '../securityDevices/device.service';
import { BadRequestException, Body, Controller, Get, Headers, HttpCode, HttpException, Ip, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { InputDataModelClassAuth, InputDataReqClass, InputDateReqConfirmClass, InputModelNewPasswordClass, emailInputDataClass } from "./auth.class";
import { UsersService } from "../../api/users/user.service";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from 'express';
import { UserDecorator, UserIdDecorator } from '../../infrastructure/decorator/decorator.user';
import { UsersQueryRepository } from '../../api/users/users.queryRepository';
import { Ratelimits } from '../../infrastructure/guards/auth/rateLimits';
import { CheckRefreshToken } from '../../infrastructure/guards/auth/checkRefreshToken';
import { RatelimitsRegistration } from '../../infrastructure/guards/auth/rateLimitsRegistration';
import { CheckRefreshTokenFindMe } from '../../infrastructure/guards/auth/checkFindMe';
import { UserClass } from '../../schema/user.schema';
import { CheckLoginOrEmail } from '../../infrastructure/guards/auth/checkEmailOrLogin';
import { IsExistEmailUser } from '../../infrastructure/guards/auth/isExixtEmailUser';
import { IsConfirmed } from '../../infrastructure/guards/auth/isCodeConfirmed';
import { CommandBus } from '@nestjs/cqrs';
import { RecoveryPasswordCommand } from '../users/use-case/recoveryPassowrd-use-case';
import { NewPasswordCommand } from '../users/use-case/createNewPassword-use-case';
import { CreateLoginCommand } from '../users/use-case/createLogin-use-case';
import { CreateDeviceCommand } from '../../api/securityDevices/use-case/createDevice-use-case';
import { RefreshTokenCommand } from './use-case/refreshToken-use-case';
import { UpdateDeviceCommand } from '../../api/securityDevices/use-case/updateDevice-use-case';
import { RegistrationConfirmationCommand } from '../users/use-case/registratinConfirmation-use-case';
import { RegistrationCommand } from '../../api/users/use-case/registration-use-case';
import { RegistrationEmailResendingCommand } from '../../api/users/use-case/registrationEmailResending-use-case';
import { LogoutCommand } from '../../api/securityDevices/use-case/logout-use-case';
import { GetUserIdByTokenCommand } from './use-case/getUserIdByToken-use-case';
import { Throttle } from '@nestjs/throttler';
import { CheckRefreshTokenForGet } from '../../infrastructure/guards/comments/bearer.authGetComment';
import { CheckRefreshTokenForComments } from '../../infrastructure/guards/comments/bearer.authForComments';

@Controller('auth')
export class AuthController {
	constructor(
		protected commandBus: CommandBus,
		protected usersService: UsersService,
		protected jwtService: JwtService,
		protected deviceService: DeviceService,
		protected usersQueryRepository: UsersQueryRepository
	) {}

	@HttpCode(204)
	@Post("password-recovery")
	@UseGuards(Ratelimits)
	async createPasswordRecovery(@Body() emailInputData: emailInputDataClass) {
		const command = new RecoveryPasswordCommand(emailInputData.email)
		const passwordRecovery = await this.commandBus.execute(command)
	}

	@HttpCode(204)
	@Post("new-password")
	@UseGuards(Ratelimits)
	async createNewPassword(@Body() inputDataNewPassword: InputModelNewPasswordClass) {
		const command = new NewPasswordCommand(inputDataNewPassword)
		const resultUpdatePassword = await this.commandBus.execute(command)
		  if (!resultUpdatePassword) throw new BadRequestException("recovery code is incorrect, 400")
	}

	@Post('login')
	@HttpCode(200)
	async createLogin(
		@Body() inutDataModel: InputDataModelClassAuth,
		@Ip() IP: string, 
		@Headers("user-agent") deviceName = "unknown",
		@Res({passthrough: true}) res: Response) {
		const command = new CreateLoginCommand(inutDataModel)
		const user: UserClass | null = await this.commandBus.execute(command);
		  if (!user) {
			throw new UnauthorizedException("Not authorization 401")
		  } else {
			const command = new CreateDeviceCommand(IP, deviceName, user)
			const tokens = await this.commandBus.execute(command)
			if(!tokens){
				throw new HttpException("Errror", 500)
			}
			res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
            });
            return {accessToken: tokens.token};
		  }
	}
	
	@HttpCode(200)
	@Post("refresh-token")
	@UseGuards(CheckRefreshToken)
	async cretaeRefreshToken(
		@Req() req: Request,
		@Res({passthrough: true}) res: Response,
		@UserDecorator() user: UserClass,
		@UserIdDecorator() userId: string | null,
	) {
		const refreshToken: string = req.cookies.refreshToken;
		const command = new RefreshTokenCommand(refreshToken, user)
		const result: { newToken: string, newRefreshToken: string} = await this.commandBus.execute(command)
		// console.log("result: ", result)
		if(!userId) return null
		const command2 = new UpdateDeviceCommand(userId, result.newRefreshToken)
		await this.commandBus.execute(command2)
		res.cookie('refreshToken', result.newRefreshToken, {
			httpOnly: true,
			secure: true,
		});
		return {accessToken: result.newToken};
		}

	@HttpCode(204)
	@Post("registration-confirmation")
	@UseGuards(RatelimitsRegistration, IsConfirmed)
	async createRegistrationConfirmation(@Body() inputDateRegConfirm: InputDateReqConfirmClass) {
		const command = new RegistrationConfirmationCommand(inputDateRegConfirm)
		await this.commandBus.execute(command)
	}

	@Post("registration")
	@HttpCode(204)
	@UseGuards(RatelimitsRegistration, CheckLoginOrEmail)
	async creteRegistration(@Req() req: Request, @Body() inputDataReq: InputDataReqClass) {
		const command = new RegistrationCommand(inputDataReq)
		const user = await this.commandBus.execute(command)
		  if (!user) throw new BadRequestException("400")
		  return
	}

	@HttpCode(204)
	// @Throttle({default: {ttl: 10000, limit: 5}})
	@Post("registration-email-resending")
	@UseGuards(IsExistEmailUser)
	@UseGuards(RatelimitsRegistration)
	// @UseGuards(ThrottlerGuard)
	async createRegistrationEmailResending(@Req() req: Request, @Body() inputDateReqEmailResending: emailInputDataClass) {
		const command = new RegistrationEmailResendingCommand(inputDateReqEmailResending)
		const confirmUser = await this.commandBus.execute(command)
		  if (!confirmUser) throw new BadRequestException("400")
		  return true
	}

	@HttpCode(204)
	@Post("logout")
	@UseGuards(CheckRefreshToken)
	async cretaeLogout(@Req() req: Request) {
		const refreshToken: string = req.cookies.refreshToken;
		// console.log("refreshToken: ", refreshToken)
		const command = new LogoutCommand(refreshToken)
		const isDeleteDevice = await this.commandBus.execute(command)
		if (!isDeleteDevice) throw new UnauthorizedException('Not authorization 401')
		// console.log('res.clearCookie("refreshToken"): ', res.clearCookie("refreshToken"))
		// res.clearCookie("refreshToken")
	}

	@HttpCode(200)
	@Get("me")
	// @UseGuards(CheckRefreshTokenFindMe)
	// @UseGuards(CheckRefreshTokenForGet)
	@UseGuards(CheckRefreshTokenForComments)
	async findMe(@Req() req: Request) {
		if (!req.headers.authorization) throw new UnauthorizedException('Not authorization 401')
		const command = new GetUserIdByTokenCommand(req)
		const findUserById: UserClass = await this.commandBus.execute(command)
		  return {
			userId: findUserById._id.toString(),
			email: findUserById.accountData.email,
			login: findUserById.accountData.userName,
		  }
	}
}
