// import mongoose from "mongoose"
// import { UserViewType } from "./user.type"
// import { WithId } from "mongodb"
// import { Users } from "./user.class"

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
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
export class UserClass {
	@Prop({
		required: true
	})
	accountData: {
		userName: string,
		email: string,
		passwordHash: string,
		createdAt: string
	}

	@Prop({
		require: true
	})
	emailConfirmation: {
				confirmationCode: string
				expirationDate: Date,
				isConfirmed: boolean
			}
}

export const UserSchema = SchemaFactory.createForClass(UserClass);

