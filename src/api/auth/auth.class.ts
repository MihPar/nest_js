import { applyDecorators } from "@nestjs/common"
import { Transform, TransformFnParams } from "class-transformer"
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length, Matches, MaxLength, MinLength } from "class-validator"

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
	return applyDecorators(IsString(), Trim(), IsNotEmpty())
}

export class emailInputDataClass {
	@RequiredString()
	@IsEmail()
	email: string
}

export class InputModelNewPasswordClass {
	// @RequiredString()
	// @Length(6, 20, {message: "The length of password is incorrect"})
	@IsString()
	@Trim() 
	@MinLength(6)
	@MaxLength(20)
	newPassword: string

	// @RequiredString()
	@IsString()
	@Trim() 
	@IsNotEmpty()
	recoveryCode: string
}

export class InputDateReqConfirmClass {
	@IsString()
	@Trim()
	@UUID()
	code: string
}

export class InputDataReqClass {
	// @RequiredString()
	// @Length(3, 10, {message: "The length is more than need"})
	@IsString()
	@Trim() 
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(10)
	login: string
	
	// @RequiredString()
	// @Length(6, 20, {message: "The length is more than need"})
	@IsString()
	@Trim() 
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	password: string

	// @RequiredString()
	@IsEmail()
	@IsString()
	@Trim() 
	@IsNotEmpty()
	email: string
}