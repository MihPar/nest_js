import { IsMongoId, IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { applyDecorators } from "@nestjs/common";

const Trim = () => Transform(({value}: TransformFnParams) => value?.trim())

function IsOptional() {
	return applyDecorators(IsString(), Trim(), IsNotEmpty())
}

  export class bodyBlogsModel {
	@IsOptional()
	@Length(1, 15)
	name: string
	@Length(1, 500)
	@IsOptional()
    description: string
	@Length(1, 100)
	@IsOptional()
	@IsUrl()
    websiteUrl: string
}

export class inputModelClass {
	@IsMongoId()
	blogId: string
}