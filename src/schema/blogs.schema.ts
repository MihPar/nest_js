import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type BlogDocument = HydratedDocument<BlogClass>
@Schema()
export class BlogClass {
		_id: Types.ObjectId
	@Prop({required: true})
		name: string
	@Prop({required: true})
		description: string
	@Prop({required: true})
		websiteUrl: string
	@Prop({required: true})
		reatedAt: string
	@Prop({required: true})
		isMembership: boolean
}

// module.exports = mongoose.model("UserSchema", UserSchema);
export const BlogSchema = SchemaFactory.createForClass(BlogClass)