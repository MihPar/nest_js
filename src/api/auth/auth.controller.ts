import { DeviceService } from '../securityDevices/device.service';
import { BadRequestException, Body, Controller, Headers, HttpCode, Ip, Post, Req, Res, UnauthorizedException, UseFilters, UseGuards } from "@nestjs/common";
import { InputDataModelClassAuth, InputDataReqClass, InputDateReqConfirmClass, InputModelNewPasswordClass, emailInputDataClass } from "./auth.class";
import { UsersService } from "../../api/users/user.service";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from 'express';
import { UserDecorator, UserIdDecorator } from '../../infrastructure/decorator/decorator.user';
import { UsersQueryRepository } from '../../api/users/users.queryRepository';
import { Ratelimits } from '../../infrastructure/guards/auth/rateLimits';
import { CheckRefreshToken } from '../../infrastructure/guards/auth/checkRefreshToken';
import { HttpExceptionFilter } from '../../exceptionFilters.ts/exceptionFilter';
import { RatelimitsRegistration } from '../../infrastructure/guards/auth/rateLimitsRegistration';
import { CheckRefreshTokenFindMe } from '../../infrastructure/guards/auth/checkFindMe';
import { ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';
import { UserClass } from '../../schema/user.schema';

@Controller('auth')
export class AuthController {
	constructor(
		protected usersService: UsersService,
		protected jwtService: JwtService,
		protected deviceService: DeviceService,
		protected usersQueryRepository: UsersQueryRepository
	) {}

	@HttpCode(204)
	@Post("password-recovery")
	@UseGuards(Ratelimits)
	@UseFilters(new HttpExceptionFilter())
	async createPasswordRecovery(@Body() emailInputData: emailInputDataClass) {
		const passwordRecovery = await this.usersService.recoveryPassword(emailInputData.email);
	}

	@HttpCode(204)
	@Post("new-password")
	@UseGuards(Ratelimits)
	@UseFilters(new HttpExceptionFilter())
	async createNewPassword(@Body() inputDataNewPassword: InputModelNewPasswordClass) {
		const resultUpdatePassword = await this.usersService.setNewPassword(
			inputDataNewPassword.newPassword,
			inputDataNewPassword.recoveryCode
		  );
		  if (!resultUpdatePassword) throw new BadRequestException("recovery code is incorrect, 400")
	}

	@Post('login')
	@HttpCode(200)
	@UseFilters(new HttpExceptionFilter())
	async createLogin(
		@Body() inutDataModel: InputDataModelClassAuth,
		@Ip() IP: string, 
		@Headers() Headers: any,
	@Res({passthrough: true}) res: Response) {
		const user: UserClass | null = await this.usersService.checkCridential(
			inutDataModel.loginOrEmail,
			inutDataModel.password
		  );
		  if (!user) {
			throw new UnauthorizedException("Not authorization 401")
		  } else {
			const token: string = await this.jwtService.signAsync({userId: user._id.toString()}, {expiresIn: "60s"});
			const ip = IP || "unknown";
			const title = Headers["user-agent"] || "unknown";
			const refreshToken = await this.jwtService.signAsync({userId: user._id.toString(), deviceId: randomUUID()}, {expiresIn: "600s"});
			await this.deviceService.createDevice(ip, title, refreshToken);

			res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
            });
            return {accessToken: token};
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
		// const userId = req.user._id.toString();
		const payload = await this.jwtService.decode(refreshToken);
		if (!payload) {
		  throw new UnauthorizedException("Not authorization 401")
		}
		const newToken: string = await this.jwtService.signAsync(user);
		const newRefreshToken: string = await this.jwtService.signAsync(
			{payload: user._id.toString()},
		  	payload.deviceId
		);
		if(!userId) return null
		const updateDeviceUser = await this.deviceService.updateDevice(
		  userId,
		  newRefreshToken
		);
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
		});
		return {accessToken: newToken};
		}

	@HttpCode(204)
	@Post("registration-confirmation")
	@UseGuards(RatelimitsRegistration)
	@UseFilters(new HttpExceptionFilter())
	async createRegistrationConfirmation(@Body() inputDateRegConfirm: InputDateReqConfirmClass) {
		await this.usersService.findUserByConfirmationCode(inputDateRegConfirm.code);
	}

	@HttpCode(204)
	@Post("registration")
	@UseGuards(RatelimitsRegistration)
	@UseFilters(new HttpExceptionFilter())
	async creteRegistration(@Body() inputDataReq: InputDataReqClass) {
		const user = await this.usersService.createNewUser(
			inputDataReq.login,
			inputDataReq.password,
			inputDataReq.email
		  );
		  if (!user) throw new BadRequestException("400")
	}

	@HttpCode(204)
	@Post("registration-email-resending")
	@UseGuards(RatelimitsRegistration)
	@UseFilters(new HttpExceptionFilter())
	async createRegistrationEmailResending(@Body() inputDateReqEmailResending: emailInputDataClass) {
		const confirmUser = await this.usersService.confirmEmailResendCode(
			inputDateReqEmailResending.email
		  );
		  if (!confirmUser) throw new BadRequestException("400")
	}

	@HttpCode(204)
	@Post("logout")
	@UseGuards(CheckRefreshToken)
	async cretaeLogout(@Req() req: Request) {
		const refreshToken: string = req.cookies.refreshToken;
		const isDeleteDevice = await this.deviceService.logoutDevice(refreshToken);
		if (!isDeleteDevice) throw new UnauthorizedException('Not authorization 401')
	}

	@HttpCode(200)
	@Post("me")
	@UseGuards(CheckRefreshTokenFindMe)
	async findMe(@Req() req: Request) {
		if (!req.headers.authorization) throw new UnauthorizedException('Not authorization 401')

		  const token: string = req.headers.authorization!.split(" ")[1];
		  const userId: ObjectId = await this.jwtService.verifyAsync(token);
		  if (!userId) throw new UnauthorizedException('Not authorization 401')

		  const currentUser: UserClass | null = await this.usersQueryRepository.findUserById(
			userId
		  );
		  if (!currentUser) throw new UnauthorizedException('Not authorization 401')

		  return {
			userId: currentUser._id.toString(),
			email: currentUser.accountData.email,
			login: currentUser.accountData.userName,
		  }
	}
}
