import { applyDecorators } from "@nestjs/common"
import { Transform, TransformFnParams } from "class-transformer"
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length, Matches } from "class-validator"

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
	@RequiredString()
	@IsEmail()
	@Matches('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
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