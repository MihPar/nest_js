import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<PostClass>;

@Schema()
export class LikeInfoClass {
	@Prop({required: true,})
		likesCount: number
	@Prop({required: true,})
		dislikesCount: number
}

export const LikeInfoSchema = SchemaFactory.createForClass(LikeInfoClass);

@Schema()
export class PostClass {
  	_id: Types.ObjectId;
  @Prop({required: true, type: String})
  	title: string;
  @Prop({type: String, required: true})
  	shortDescription: string;
  @Prop({required: true})
 	content: string;
  @Prop({required: true})
  	blogId: string;
  @Prop({required: true})
 	 blogName: string;
  @Prop({required: true,})
  	createdAt: string;
  @Prop({required: true, type: LikeInfoSchema})
  	extendedLikesInfo: LikeInfoClass
}

export const PostSchema = SchemaFactory.createForClass(PostClass);
