import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";


export type UserDocument = HydratedDocument<UserClass>

@Schema({ _id: false, versionKey: false })
export class AccountDataClass {
		//_id?: mongoose.Types.ObjectId;
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

@Schema({ _id: false, versionKey: false })
export class EmailConfirmationClass {
		//_id?: mongoose.Types.ObjectId;
	@Prop({required: true})
		confirmationCode: string
	@Prop({required: true})
		expirationDate: Date
	@Prop({required: true})
		isConfirmed: boolean
}
export const EmailConfirmationSchena = SchemaFactory.createForClass(EmailConfirmationClass)

@Schema({ _id: false, versionKey: false })
export class UserClass {
		_id?: mongoose.Types.ObjectId
	@Prop({required: true})
		accountData: AccountDataClass
	@Prop({require: true})
		emailConfirmation: EmailConfirmationClass
}
export const UserSchema = SchemaFactory.createForClass(UserClass);

