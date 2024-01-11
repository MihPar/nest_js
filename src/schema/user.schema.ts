import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AccountDataType, EmailConfirmationType, UserViewType } from "api/users/user.type";
import { ObjectId } from "mongodb";
import mongoose, { HydratedDocument, Types } from "mongoose";


export type UserDocument = HydratedDocument<UserClass>

@Schema({ versionKey: false })
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

@Schema({ versionKey: false })
export class EmailConfirmationClass {
	@Prop({required: true})
		confirmationCode: string
	@Prop({required: true})
		expirationDate: Date
	@Prop({required: true})
		isConfirmed: boolean
}
export const EmailConfirmationSchena = SchemaFactory.createForClass(EmailConfirmationClass)

@Schema({ versionKey: false })
export class UserClass {
		_id: mongoose.Types.ObjectId
	@Prop({required: true})
		accountData: AccountDataClass
	@Prop({require: true})
		emailConfirmation: EmailConfirmationClass
		id: ObjectId;
	 getViewUser(): UserViewType {
		// const user = new this()
		return {
			id: this._id.toString(),
			login: this.accountData.userName,
			email: this.accountData.email,
			createdAt: this.accountData.createdAt
		}
		// user.id = _id
		// user.accountData.userName = login
		// user.accountData.email = email
		// user.accountData.createdAt = createdAt
	}
}
export const UserSchema = SchemaFactory.createForClass(UserClass);

UserSchema.methods = {
	getViewUser: UserClass.prototype.getViewUser
}