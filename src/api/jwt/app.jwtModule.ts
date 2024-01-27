import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ApiConfigService } from "../../infrastructure/config/apiConfigService";
import { ApiJwtService } from "./jwt.service";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [
				// ApiConfigModule
			],
			extraProviders: [ApiConfigService],
			inject: [ApiConfigService],
			useFactory: (apiConfigService: ApiConfigService) => {
				return {
					secret: apiConfigService.JWT_SECRET,
					signOptions: {expiresIn: apiConfigService.EXPIRED_JWT}
				}
			}
		})
	],
	providers: [
		ApiJwtService, ApiConfigService
	],
	exports: [
		ApiJwtService
	]
})

export class ApiJwtModule{}