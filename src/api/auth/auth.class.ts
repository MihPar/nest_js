import { applyDecorators } from "@nestjs/common"
import { Transform, TransformFnParams } from "class-transformer"
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from "class-validator"

const UUID_VERSION = '4' 

const UUID = () => IsUUID(UUID_VERSION)

export class InputDataModelClassAuth {
	@IsString()
	loginOrEmail: string
	@IsString()
  	password: string
}

const Trim = () => Transform(({value}: TransformFnParams) => value?.trim())

function RequiredString() {
	return applyDecorators(IsNotEmpty(), IsString(), Trim())
}

export class emailInputDataClass {
	@IsEmail()
	@RequiredString()
	email: string
}

export class InputModelNewPasswordClass {
	@RequiredString()
	@Length(6, 20, {message: "The length of password is incorrect"})
	newPassword: string
	@RequiredString()
	recoveryCode: string
}

export class InputDateReqConfirmClass {
	@IsString()
	@Trim()
	@UUID()
	code: string
}

// const CheckLoginOrEmail = () => Transform(async ({ value }: TransformFnParams) => 
// 	{const user: UserClass | null = await this.userModel.findOne({
// 		$or: [
// 		  { "accountData.email": loginOrEmail },
// 		  { "accountData.userName": loginOrEmail },
// 		],
// 	  }).lean(); 
// 	  return user}
// )

export class InputDataReqClass {
	@RequiredString()
	@Length(3, 10, {message: "The length is more than need"})
	login: string
	@RequiredString()
	@Length(6, 20, {message: "The length is more than need"})
	password: string
	@RequiredString()
	@IsEmail()
	email: string
}