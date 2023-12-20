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
import { HydratedDocument } from 'mongoose';
import { LikeStatusEnum } from './likes.emun';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({
	required: true
  })
  userId: string;

  @Prop({
	required: true
  })
  login: number;

  @Prop({
	required: true
  })
  commentId: string;


  @Prop({
	required: true
  })
  postId: string;

  @Prop({
	required: true
  })
  myStatus: {
      type: String,
      default: LikeStatusEnum.None,
      enum: ["None", "Like", "Dislike"],
    }

  @Prop({
	required: true
  })
  addedAt: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);