import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { ApiConfigService } from "../../infrastructure/config/apiConfigService"

@Injectable()
export class JWTService {
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

	async createJWT(userId: number, deviceId: number): Promise<any> {
		const secretRT = this.apiConfigService.REFRESH_JWT_SECRET
		const expiresInRT = this.apiConfigService.EXPIRED_REFRESH_JWT_SECRET

		const accessToken = this.jwtService.sign({userId})
		const refreshToken = this.jwtService.sign({userId, deviceId}, {secret: secretRT, expiresIn: expiresInRT})

		return {
			accessToken,
			refreshToken
		}
		// const token: string = await jwt.sign({userId: user._id}, process.env.JWT_SECRET!, {expiresIn: '5m'})
		// return token
	}

	// async createRefreshJWT(userId: string, existDeviceId?: ObjectId) {
	// 	const deviceId: ObjectId = new ObjectId()
	// 	const refreshToken: string = await jwt.sign({deviceId: existDeviceId ?? deviceId, userId}, process.env.REFRESH_JWT_SECRET as string, {expiresIn: '10m'})
	// 	return refreshToken
	// }

	// getLastActiveDate(token: string) {
	// 	const result: any = jwt.decode(token)
	// 	return new Date(result.iat * 1000).toISOString()
	// }

	// async getUserIdByToken(token: string) {
	// 	try {
	// 		const result: any = await jwt.verify(token, process.env.JWT_SECRET!)
	// 		return new ObjectId(result.userId)
	// 	} catch(err) {
	// 		return null
	// 	}
	// }
}