import { Body, Controller, Post } from '@nestjs/common';
import {
  BodyPasswordRecoveryCode,
  BodyRegistrationConfirmationModel,
  BodyRegistrationModel,
  EmailResending,
  bodyAuthModel,
} from './auth.type';
import { UserService } from '../users/user.service';
import { Users } from '../users/user.class';
import { JWTService } from '../jwt/jwt.service';
import { DeviceService } from '../securityDevices/device.service';

@Controller()
export class AuthController {
  constructor(
    protected userService: UserService,
    protected jwtService: JWTService,
    protected deviceService: DeviceService,
  ) {}

  @Post()
  async createPasswordRecowery(@Body() inputDataModel: EmailResending) {
    const passwordRecovery = await this.userService.recoveryPassword(
      inputDataModel.email,
    );
    // if (!passwordRecovery) {
    //   return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    // }
    // return res.sendStatus(204);
  }

  @Post()
  async createNewPassword(@Body() inputDataModel: BodyPasswordRecoveryCode) {
    const resultUpdatePassword = await this.userService.setNewPassword(
      inputDataModel.newPassword,
      inputDataModel.recoveryCode,
    );
    //   if (!resultUpdatePassword) {
    // 	return res.status(HTTP_STATUS.BAD_REQUEST_400).send({
    // 	  errorsMessages: [
    // 		{ message: "recovery code is incorrect", field: "recoveryCode" },
    // 	  ],
    // 	});
    //   }
    //   return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  @Post()
  async createLogin(@Body() inputDataMode: bodyAuthModel) {
    const user: Users | null = await this.userService.checkCridential(
      inputDataMode.loginOrEmail,
      inputDataMode.password,
    );
    if (!user) {
      //   return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    } else {
      const token: string = await this.jwtService.createJWT(user);
      const ip = req.socket.remoteAddress || 'unknown';
      const title = req.headers['user-agent'] || 'unknown';
      const refreshToken = await this.jwtService.createRefreshJWT(
        user._id.toString(),
      );
      await this.deviceService.createDevice(ip, title, refreshToken);
    //   return res
        // .cookie('refreshToken', refreshToken, {
        //   httpOnly: true,
        //   secure: true,
        // })
        // .status(HTTP_STATUS.OK_200)
        // .send({ accessToken: token });
    }
  }

  @Post()
  async createRefreshToken() {
	const refreshToken: string = req.cookies.refreshToken;
    const userId = req.user._id.toString();
    const payload = await this.jwtService.decodeRefreshToken(refreshToken);
    // if (!payload) {
    //   res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    //   return;
    // }
    const newToken: string = await this.jwtService.createJWT(req.user);
    const newRefreshToken: string = await this.jwtService.createRefreshJWT(
      userId,
      payload.deviceId
    );
    const updateDeviceUser = await this.deviceService.updateDevice(
      userId,
      newRefreshToken
    );
    // res
    //   .cookie("refreshToken", newRefreshToken, {
    //     httpOnly: true,
    //     secure: true,
    //   })
    //   .status(HTTP_STATUS.OK_200)
    //   .send({ accessToken: newToken })
  }

  @Post()
  async createRegistrationConfirmation(@Body() inputDataMode: BodyRegistrationConfirmationModel) {
    await this.userService.findUserByConfirmationCode(inputDataMode.code);
    // return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  @Post()
  async createRegistration(@Body() inputDataModel: BodyRegistrationModel) {
	const user = await this.userService.createNewUser(
		inputDataModel.login,
		inputDataModel.password,
		inputDataModel.email
	  );
	//   if (!user) {
	// 	return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
	//   } else {
	// 	return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
	//   }
  }
}
