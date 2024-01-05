import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


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

@Schema({ _id: false, versionKey: false })
export class UserClass {
	@Prop({required: true})
		accountData: AccountDataClass
	@Prop({require: true})
		emailConfirmation: EmailConfirmationClass
}
export const UserSchema = SchemaFactory.createForClass(UserClass);

