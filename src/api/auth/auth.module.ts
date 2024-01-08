// import { jwtConstants } from '/constants';
// import { Module } from "@nestjs/common";
// import { JwtModule } from "@nestjs/jwt";
// import { PassportModule } from "@nestjs/passport";
// import { UserClass } from "schema/user.schema";

// @Module({
// 	imports: [
// 		UserClass,
// 		PassportModule,
// 		JwtModule.register({
// 			secret: jwtConstants.secret,
// 			signOptions: {expiresIn: '6m'}
// 		})
// 	],
// 	providers: [],
// 	exports: []
// })

// export class AuthModule {}