import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ApiConfigService } from "../config/apiConfigService";
import { ApiConfigModule } from "../config/apiConfigModule";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ApiConfigModule],
			inject: [ApiConfigService],
			useFactory: (apiConfigService: ApiConfigService) => {
				return {
					secret: apiConfigService.JWT_SECRET,
					signOptions: {expiresIn: apiConfigService.EXPIRED_JWT_SECRET}
				}
			}
		})
	],
	providers: [
		// ApiJwtService
	],
	exports: [
		// ApiJwtService
	]
})

export class ApiJwtModule{}