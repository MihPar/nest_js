// import { WithId } from "mongodb";
// import mongoose from "mongoose";
// import { Like } from "./likes.class";
// import { LikeStatusEnum } from "./likes.emun";

// export const LikesInfoSchema = new mongoose.Schema<WithId<Like>>({
//   userId: { type: mongoose.Schema.Types.ObjectId, require: true },
//   login: {type: String, require: true},
//   commentId: { type: String, nullable: true },
//   postId: { type: String, nullable: true },
//   myStatus: {
//     type: String,
//     default: LikeStatusEnum.None,
//     enum: ["None", "Like", "Dislike"],
//   },
//   addedAt: { type: String, require: true },
// });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LikeStatusEnum } from '../api/likes/likes.emun';
import { PostsDB } from 'src/api/posts/posts.class';
import { newestLikesType } from 'src/api/likes/likes.type';
import { PostsViewModel } from 'src/api/posts/posts.type';
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