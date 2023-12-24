// import mongoose from "mongoose"
// import { UserViewType } from "./user.type"
// import { WithId } from "mongodb"
// import { Users } from "./user.class"

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument } from "mongoose";

// export const DBUserSchema = new mongoose.Schema<WithId<Users>>({
// 	accountData: {
// 		userName: {type: String, require: true},
// 		email: {type: String, require: true},
// 		passwordHash: {type: String, require: true},
// 		createdAt: {type: String, require: true}
// 	},
//     emailConfirmation: {
// 		confirmationCode: {type: String, require: false},
// 		expirationDate: {type: Date, require: false},
// 		isConfirmed: {type: Boolean, require: false}
// 	},
// })

// export const UsersType = new mongoose.Schema<WithId<UserViewType>>({
// 	login: {type: String, require: true},
// 	email: {type: String, require: true},
// 	createdAt: {type: String, require: true}
// })

export type UserDocument = HydratedDocument<UserClass>

@Schema()
export class AccountDataClass {
	@Prop({required: true})
		userName: string
	@Prop({required: true})
		email: string
	@Prop({required: true})
		passwordHash: string
	@Prop({required: true})
		createdAt: string
}
export const AccountDataSchena = SchemaFactory.createForClass(AccountDataClass);

@Schema()
export class EmailConfirmationClass {
	@Prop({required: true})
		confirmationCode: string
	@Prop({required: true})
	expirationDate: Date
	@Prop({required: true})
		isConfirmed: boolean
}
export const EmailConfirmationSchena = SchemaFactory.createForClass(EmailConfirmationClass)

@Schema()
export class UserClass {
	@Prop({required: true})
		accountData: AccountDataClass
	@Prop({require: true})
		emailConfirmation: EmailConfirmationClass
}
export const UserSchema = SchemaFactory.createForClass(UserClass);

