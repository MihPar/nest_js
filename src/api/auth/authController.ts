import { DeviceService } from './../securityDevices/device.service';
import { BadRequestException, Body, Controller, Headers, HttpCode, Ip, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { InputDataModelClassAuth, InputDataReqClass, InputDateReqConfirmClass, InputModelNewPasswordClass, emailInputDataClass } from "./auth.class";
import { Users } from "api/users/user.class";
import { UsersService } from "api/users/user.service";
import { JwtService } from "@nestjs/jwt";
import { Response } from 'express';
import { UserDecorator, UserIdDecorator } from 'infrastructure/decorator/decorator.user';
import { UsersQueryRepository } from 'api/users/users.queryRepository';
import { Ratelimits } from '../../infrastructure/guards/auth/rateLimets';
import { AuthGuard } from '@nestjs/passport';
import { CheckRefreshToken } from 'infrastructure/guards/auth/checkRefreshToken';

@Controller('auth')
export class AuthController {
	constructor(
		protected usersService: UsersService,
		protected jwtService: JwtService,
		protected deviceService: DeviceService,
		protected usersQueryRepository: UsersQueryRepository
	) {}

	@HttpCode(204)
	@Post()
	async createPasswordRecovery(@Body() emailInputData: emailInputDataClass) {
		const passwordRecovery = await this.usersService.recoveryPassword(emailInputData.email);
	}

	@HttpCode(204)
	@Post()
	async createNewPassword(@Body() inputDataNewPassword: InputModelNewPasswordClass) {
		const resultUpdatePassword = await this.usersService.setNewPassword(
			inputDataNewPassword.newPassword,
			inputDataNewPassword.recoveryCode
		  );
		  if (!resultUpdatePassword) throw new BadRequestException("recovery code is incorrect, 400")
	}

	@HttpCode(200)
	@Post()
	@UseGuards(Ratelimits)
	async createLogin(@Body() inutDataModel: InputDataModelClassAuth, @Ip() IP: string, @Headers() Headers: any,
	@Res({passthrough: true}) res: Response) {
		const user: Users | null = await this.usersService.checkCridential(
			inutDataModel.loginOrEmail,
			inutDataModel.password
		  );
		  if (!user) {
			throw new UnauthorizedException("Not authorization 401")
		  } else {
			const token: string = await this.jwtService.signAsync(user);
			const ip = IP || "unknown";
			const title = Headers["user-agent"] || "unknown";
			const refreshToken = await this.jwtService.signAsync({payload: user._id.toString()}, {expiresIn: "600s"});
			await this.deviceService.createDevice(ip, title, refreshToken);

			res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
            });
            return {accessToken: token};
		  }
	}
	@HttpCode(200)
	@Post()
	@UseGuards(CheckRefreshToken)
	async cretaeRefreshToken(
		@Req() req: Request,
		@Res({passthrough: true}) res: Response,
		@UserDecorator() user: Users,
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
	@Post()
	async createRegistrationConfirmation(@Body() inputDateRegConfirm: InputDateReqConfirmClass) {
		await this.usersService.findUserByConfirmationCode(inputDateRegConfirm.code);
	}

	@HttpCode(204)
	@Post()
	async creteRegistration(@Body() inputDataReq: InputDataReqClass) {
		const user = await this.usersService.createNewUser(
			inputDataReq.login,
			inputDataReq.password,
			inputDataReq.email
		  );
		  if (!user) throw new BadRequestException("400")
	}

	@HttpCode(204)
	@Post()
	async createRegistrationEmailResending(@Body() inputDateReqEmailResending: emailInputDataClass) {
		const confirmUser = await this.usersService.confirmEmailResendCode(
			inputDateReqEmailResending.email
		  );
		  if (!confirmUser) throw new BadRequestException("400")
	}

	@HttpCode(204)
	@Post()
	async cretaeLogout(@Req() req: Request) {
		const refreshToken: string = req.cookies.refreshToken;
		const isDeleteDevice = await this.deviceService.logoutDevice(refreshToken);
		if (!isDeleteDevice) throw new UnauthorizedException('Not authorization 401')
	}

	@HttpCode(200)
	@Post()
	async findMe(@Req() req: Request) {
		if (!req.headers.authorization) throw new UnauthorizedException("Not authorization 401")
		//   const token: string = req.headers.authorization!.split(" ")[1];
		const [type, token] = req.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
		  const userId: ObjectId | null = await this.jwtService.getUserIdByToken(
			token
		  );
		  if (!userId) return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
		  const currentUser: Users | null = await this.usersQueryRepository.findUserById(
			userId
		  );
		  if (!currentUser) return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
		  return res.status(HTTP_STATUS.OK_200).send({
			userId: currentUser._id.toString(),
			email: currentUser.accountData.email,
			login: currentUser.accountData.userName,
		  });
	}
}
