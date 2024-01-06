import { ObjectId } from "mongodb"
import { BlogsViewType } from "./blogs.type"
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { applyDecorators } from "@nestjs/common";

export class Blogs {
	public createdAt: string
	constructor(
		public name: string,
		public description: string,
		public websiteUrl: string,
		public isMembership: boolean) {
			this.createdAt = new Date().toISOString()
		}
  };

  export class BlogsDB extends Blogs {
	public _id: ObjectId
	constructor(
		 name: string,
		 description: string,
		 websiteUrl: string,
		 isMembership: boolean) {
			super(name,
				description,
				websiteUrl,
				isMembership)
				this._id = new ObjectId()
		 }
		static getBlogsViewModel(blog: BlogsDB): BlogsViewType {
			return {
				id: blog._id.toString(),
				name: blog.name,
				description: blog.description,
				websiteUrl: blog.websiteUrl,
				createdAt: blog.createdAt,
				isMembership: blog.isMembership
			}
		}
		 getBlogViewModel(): BlogsViewType {
			return {
				id: this._id.toString(),
				name: this.name,
				description: this.description,
				websiteUrl: this.websiteUrl,
				createdAt: this.createdAt,
				isMembership: this.isMembership
			}
		}
  };

const Trim = () => Transform(({value}: TransformFnParams) => value?.trim())

function IsOptional() {
	return applyDecorators(Trim(), IsString(), IsNotEmpty())
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