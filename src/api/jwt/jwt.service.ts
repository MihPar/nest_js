import { Injectable } from "@nestjs/common"
import jwt from "jsonwebtoken"

@Injectable()
export class JWTService {
	constructor() {}
	async decodeRefreshToken(refreshToken: string) {
		try {
			const result = jwt.decode(refreshToken)
			return result as jwt.JwtPayload
	   } catch(err) {
		   return null
	   }
	}
}