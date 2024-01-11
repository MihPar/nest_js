import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BlogsViewType } from "api/blogs/blogs.type";
import mongoose, { HydratedDocument } from "mongoose";

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

export type BlogDocument = HydratedDocument<BlogClass>

@Schema({ versionKey: false })
export class BlogClass extends Blogs {
	constructor(
		name: string,
		description: string,
		websiteUrl: string,
		isMembership: boolean) {
		super(name, description, websiteUrl,isMembership)
	}
		_id: mongoose.Types.ObjectId;
	@Prop({required: true})
		name: string
	@Prop({required: true})
		description: string
	@Prop({required: true})
		websiteUrl: string
	@Prop({required: true})
		createdAt: string
	@Prop({required: true})
		isMembership: boolean

		static getBlogsViewModel(inputBlog: BlogClass): BlogsViewType{
			return {
				id: inputBlog._id.toString(),
				name: inputBlog.name,
				description: inputBlog.description,
				websiteUrl: inputBlog.websiteUrl,
				createdAt: inputBlog.createdAt,
				isMembership: inputBlog.isMembership
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
}

export const BlogSchema = SchemaFactory.createForClass(BlogClass)

BlogSchema.methods = {
	getBlogViewModel: BlogClass.prototype.getBlogViewModel
}

BlogSchema.statics = {
	getBlogsViewModel: BlogClass.getBlogsViewModel
}