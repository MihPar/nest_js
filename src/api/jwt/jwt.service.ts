import jwt  from 'jsonwebtoken';
import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { ApiConfigService } from "../../infrastructure/config/configService"

@Injectable()
export class ApiJwtService {
	constructor(
		private jwtService: JwtService,
		private apiConfigService: ApiConfigService,
	) {}
	// async decodeRefreshToken(refreshToken: string) {
	// 	try {
	// 		const result = jwt.decode(refreshToken)
	// 		return result as jwt.JwtPayload
	//    } catch(err) {
	// 	   return null
	//    }
	// }

	async createJWT(userId: string, deviceId: string): Promise<any> {

		const secretJwt = this.apiConfigService.JWT_SECRET
		const expiredJwt = this.apiConfigService.EXPIRED_JWT
		const accessToken = this.jwtService.sign({userId}, {secret: secretJwt, expiresIn: expiredJwt})


		const secretRT = this.apiConfigService.REFRESH_JWT_SECRET
		const expiresInRT = this.apiConfigService.EXPIRED_REFRESH_JWT
		const refreshToken = this.jwtService.sign({userId, deviceId}, {secret: secretRT, expiresIn: expiresInRT})

		return {
			accessToken,
			refreshToken
		}
		// const token: string = await jwt.sign({userId: user._id}, {process.env.JWT_SECRET!, expiresIn: '5m'})
		// return token
	}

	// async createRefreshJWT(userId: string, existDeviceId?: ObjectId) {
	// 	const deviceId: ObjectId = new ObjectId()
	// 	const refreshToken: string = await jwt.sign({deviceId: existDeviceId ?? deviceId, userId}, process.env.REFRESH_JWT_SECRET as string, {expiresIn: '10m'})
	// 	return refreshToken
	// }

	async refreshToken(refreshToken: string):Promise<any> {
		try {
			const secretRT = this.apiConfigService.REFRESH_JWT_SECRET
			return this.jwtService.verify(refreshToken, {secret: secretRT})
		} catch(error) {
			return null
		}
	}

	getLastActiveDate(token: string): Date {
		const result: any = jwt.decode(token)
		return new Date(result.iat * 1000)
	}

	// async getUserIdByToken(token: string) {
	// 	try {
	// 		const result: any = await jwt.verify(token, process.env.JWT_SECRET!)
	// 		return new ObjectId(result.userId)
	// 	} catch(err) {
	// 		return null
	// 	}
	// }

	getDeviceIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.REFRESH_JWT_SECRET!)
            return result //==={userId: user._id, deviceId: deviceId}

        } catch (error) {
            return null
        }
    }
}