// import mongoose from 'mongoose'
// import { WithId } from 'mongodb'
// import { BlogsDB } from './blogs.class'

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// export const BlogsSchema = new mongoose.Schema<WithId<BlogsDB>>({
// 	name: {type: String, require: true},
// 	description: {type: String, require: true},
// 	websiteUrl: {type: String, require: true},
// 	createdAt: {type: String, require: true},
// 	isMembership: {type: Boolean, require: true},
// })


export type BlogDocument = HydratedDocument<BlogClass>
@Schema()
export class BlogClass {
	@Prop({
		required: true
	})
	name: string
	
	@Prop({
		required: true
	})
	description: string

	@Prop({
		required: true
	})
	websiteUrl: string

	@Prop({
		required: true
	})
	createdAt: string

	@Prop({
		required: true
	})
	isMembership: boolean
}

export const BlogSchema = SchemaFactory.createForClass(BlogClass)