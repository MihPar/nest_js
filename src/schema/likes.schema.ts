import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LikeStatusEnum } from '../api/likes/likes.emun';
import { ObjectId } from 'mongodb';

export type LikeDocument = HydratedDocument<LikeClass>;

@Schema()
export class LikeClass {
	_id: Types.ObjectId
  @Prop({required: true})
  	userId: ObjectId;
  @Prop({required: true})
  	login: string;
  @Prop({required: true})
  	commentId: string;
  @Prop({required: true})
  	postId: string;
  @Prop({required: true, type: String, default: LikeStatusEnum.None, enum: ["None", "Like", "Dislike"]})
  	myStatus: LikeStatusEnum
  @Prop({required: true})
  	addedAt: string;
}

export const LikeSchema = SchemaFactory.createForClass(LikeClass);