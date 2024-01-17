import { JwtService } from "@nestjs/jwt";

export class PayloadAdapter {
	constructor(
		protected readonly jwtService: JwtService
	) {}
	public async getPayload(
		token: string,
	  ): Promise<null | {
		userId: string;
		deviceId: string;
		iat: number;
		exp: number;
	  }> {
		try {
		  return this.jwtService.decode(token);
		} catch (error) {
		  return null;
		}
	  }
}


