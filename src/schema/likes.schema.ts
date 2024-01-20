import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { LikeStatusEnum } from '../api/likes/likes.emun';

export type LikeDocument = HydratedDocument<LikeClass>;

@Schema({ versionKey: false })
export class LikeClass {
	_id: mongoose.Types.ObjectId;
  @Prop({required: true})
  	userId: string;
  @Prop({required: true})
  	login: string;
  @Prop({required: false})
  	commentId: string;
  @Prop({required: true})
  	postId: string;
  @Prop({required: true, type: String, default: LikeStatusEnum.None, enum: ["None", "Like", "Dislike"]})
  	myStatus: LikeStatusEnum
  @Prop({required: true})
  	addedAt: string;
}

export const LikeSchema = SchemaFactory.createForClass(LikeClass);