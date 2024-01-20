import { IsMongoId, IsNotEmpty, IsString, IsUrl, Length, MaxLength } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { applyDecorators } from "@nestjs/common";

// const Trim = () => Transform(({value}: TransformFnParams) => value?.trim())

function IsOptional() {
	return applyDecorators(IsString(), IsNotEmpty())
}

  export class bodyBlogsModel {
	@IsOptional()
	@MaxLength(15)
	name: string
	@MaxLength(500)
	@IsOptional()
    description: string
	@IsUrl()
	@IsOptional()
	@MaxLength(100)
    websiteUrl: string
}

export class inputModelClass {
	@IsMongoId()
	blogId: string
}