import { Injectable } from "@nestjs/common";
import { ConfigServce } from "./configService";

@Injectable()
export class ApiConfigService {
 constructor(
	private configService: ConfigServce
 ) {}

 get JWT_SECRET(): string {
	return this.configService.get("JWT_SECRET", {infer: true})
 }

 get REFRESH_JWT_SECRET(): string {
	return this.configService.get("REFRESH_JWT_SECRET", {infer: true})
 }

 get EXPIRED_JWT_SECRET(): string {
	return this.configService.get("EXPIRED_JWT", {infer: true})
 }

 get EXPIRED_REFRESH_JWT_SECRET(): string {
	return this.configService.get("EXPIRED_REFRESH", {infer: true})
 }
}