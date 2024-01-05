import { applyDecorators } from "@nestjs/common"
import { Transform, TransformFnParams } from "class-transformer"
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class InputDataModelClassAuth {
	@IsString()
	loginOrEmail: string
	@IsString()
  	password: string
}

const Trim = () => Transform(({value}: TransformFnParams) => value?.trim())

function IsOptional() {
	return applyDecorators(Trim(), IsString(), IsNotEmpty())
}

export class emailInputDataClass {
	@IsEmail()
	@IsOptional()
	email: string
}

export class InputModelNewPasswordClass {
	@IsOptional()
	@Length(6, 20, {message: "The length of password is incorrect"})
	newPassword: string
	@IsOptional()
	recoveryCode: string
}

export class InputDateReqConfirmClass {
	@IsOptional()
	code: string
}

export class InputDataReqClass {
	@IsOptional()
	@Length(3, 10, {message: "The length is more than need"})
	login: string
	@IsOptional()
	@Length(6, 20, {message: "The length is more than need"})
	password: string
	@IsOptional()
	@IsEmail()
	email: string
}