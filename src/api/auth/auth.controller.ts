import { DeviceService } from '../securityDevices/device.service';
import { BadRequestException, Body, Controller, Headers, HttpCode, Ip, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
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
import { ObjectId } from 'mongodb';
import { UserClass } from '../../schema/user.schema';
import { CheckLoginOrEmail } from '../../infrastructure/guards/auth/checkEmailOrLogin';
import { IsExistEmailUser } from '../../infrastructure/guards/auth/isExixtEmailUser';
import { IsConfirmed } from '../../infrastructure/guards/auth/isCodeConfirmed';
import { CommandBus } from '@nestjs/cqrs';
import { RecoveryPasswordCommand } from '../users/use-case/recoveryPassowrd-use-case';
import { NewPassword } from '../users/use-case/createNewPassword-use-case';
import { CreateLogin } from '../users/use-case/createLogin-use-case';
import { CreateDevice } from 'api/securityDevices/use-case/createDevice-use-case';
import { RefreshToken } from './use-case/refreshToken-use-case';
import { UpdateDevice } from 'api/securityDevices/use-case/updateDevice-use-case';
import { RegistrationConfirmation } from '../users/use-case/registratinConfirmation-use-case';
import { Registration } from '../../api/users/use-case/registration-use-case';
import { RegistrationEmailResending } from 'api/users/use-case/registrationEmailResending-use-case';
import { Logout } from 'api/securityDevices/use-case/logout-use-case';
import { GetUserIdByToken } from './use-case/getUserIdByToken-use-case';

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
		// const passwordRecovery = await this.usersService.recoveryPassword(emailInputData.email);
		const passwordRecovery = await this.commandBus.execute(new RecoveryPasswordCommand(emailInputData.email))
	}

	@HttpCode(204)
	@Post("new-password")
	@UseGuards(Ratelimits)
	async createNewPassword(@Body() inputDataNewPassword: InputModelNewPasswordClass) {
		const resultUpdatePassword = await this.commandBus.execute(new NewPassword(inputDataNewPassword))
		// const resultUpdatePassword = await this.usersService.setNewPassword(
		// 	inputDataNewPassword.newPassword,
		// 	inputDataNewPassword.recoveryCode
		//   );
		  if (!resultUpdatePassword) throw new BadRequestException("recovery code is incorrect, 400")
	}

	@Post('login')
	@HttpCode(200)
	async createLogin(
		@Body() inutDataModel: InputDataModelClassAuth,
		@Ip() IP: string, 
		@Headers() Headers: any,
	@Res({passthrough: true}) res: Response) {
		// const user: UserClass |null = await this.userService.setNewPassword(inutDataModel)
		const user: UserClass | null = await this.commandBus.execute(new CreateLogin(inutDataModel));
		  if (!user) {
			throw new UnauthorizedException("Not authorization 401")
		  } else {
			// const token: string = await this.jwtService.signAsync({userId: user._id.toString()}, {expiresIn: "60s"});
			// const ip = IP || "unknown";
			// const title = Headers["user-agent"] || "unknown";
			// const refreshToken = await this.jwtService.signAsync({userId: user._id.toString(), deviceId: randomUUID()}, {expiresIn: "600s"});
			// await this.commandBus.execute(new CreateDevice(ip, title, refreshToken))
			const createDevice = await this.commandBus.execute(new CreateDevice(IP, Headers, user))
			// await this.deviceService.createDevice(ip, title, refreshToken);
			res.cookie('refreshToken', createDevice.refreshToken, {
                httpOnly: true,
                secure: true,
            });
            return {accessToken: createDevice.token};
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
		const result: { newToken: string, newRefreshToken: string} = await this.commandBus.execute(new RefreshToken(refreshToken, user))
		// const refreshToken: string = req.cookies.refreshToken;
		// // const userId = req.user._id.toString();
		// const payload = await this.jwtService.decode(refreshToken);
		// if (!result.payload) {
		//   throw new UnauthorizedException("Not authorization 401")
		// }
		// const newToken: string = await this.jwtService.signAsync(user);
		// const newRefreshToken: string = await this.jwtService.signAsync(
		// 	{payload: user._id.toString()},
		//   	payload.deviceId
		// );
		if(!userId) return null
		await this.commandBus.execute(new UpdateDevice(userId, result.newRefreshToken))
		// const updateDeviceUser = await this.deviceService.updateDevice(
		//   userId,
		//   result.newRefreshToken
		// );
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
		});
		return {accessToken: result.newToken};
		}

	@HttpCode(204)
	@Post("registration-confirmation")
	@UseGuards(RatelimitsRegistration, IsConfirmed)
	async createRegistrationConfirmation(@Body() inputDateRegConfirm: InputDateReqConfirmClass) {
		await this.commandBus.execute(new RegistrationConfirmation(inputDateRegConfirm))
		// await this.usersService.findUserByConfirmationCode(inputDateRegConfirm.code);
	}

	@Post("registration")
	@HttpCode(204)
	@UseGuards(RatelimitsRegistration, CheckLoginOrEmail)
	async creteRegistration(@Req() req: Request, @Body() inputDataReq: InputDataReqClass) {
		const user = await this.commandBus.execute(new Registration(inputDataReq))
		// const user = await this.usersService.createNewUser(
		// 	inputDataReq.login,
		// 	inputDataReq.password,
		// 	inputDataReq.email
		//   );
		  if (!user) throw new BadRequestException("400")
		  return
	}

	@HttpCode(204)
	@Post("registration-email-resending")
	@UseGuards(RatelimitsRegistration, IsExistEmailUser)
	// @UseGuards(ThrottlerGuard)
	//@Throttle({default: {ttl: 10000, limit: 5}})
	async createRegistrationEmailResending(@Req() req: Request, @Body() inputDateReqEmailResending: emailInputDataClass) {
		const confirmUser = await this.commandBus.execute(new RegistrationEmailResending(inputDateReqEmailResending))
		// const confirmUser = await this.usersService.confirmEmailResendCode(
		// 	inputDateReqEmailResending.email
		//   );
		  if (!confirmUser) throw new BadRequestException("400")
		  return true
	}

	@HttpCode(204)
	@Post("logout")
	@UseGuards(CheckRefreshToken)
	async cretaeLogout(@Req() req: Request) {
		const refreshToken: string = req.cookies.refreshToken;
		const isDeleteDevice = await this.commandBus.execute(new Logout(refreshToken))
		// const isDeleteDevice = await this.deviceService.logoutDevice(refreshToken);
		if (!isDeleteDevice) throw new UnauthorizedException('Not authorization 401')
	}

	@HttpCode(200)
	@Post("me")
	@UseGuards(CheckRefreshTokenFindMe)
	async findMe(@Req() req: Request) {
		if (!req.headers.authorization) throw new UnauthorizedException('Not authorization 401')
		const findUserById: UserClass = await this.commandBus.execute(new GetUserIdByToken(req))
		//   const token: string = req.headers.authorization!.split(" ")[1];
		//   const userId: ObjectId = await this.jwtService.verifyAsync(token);
		//   if (!userId) throw new UnauthorizedException('Not authorization 401')
		//   const currentUser: UserClass | null = await this.usersQueryRepository.findUserById(
		// 	getUserIdByToken.userId
		//   );
		//   if (!currentUser) throw new UnauthorizedException('Not authorization 401')
		  return {
			userId: findUserById._id.toString(),
			email: findUserById.accountData.email,
			login: findUserById.accountData.userName,
		  }
	}
}
