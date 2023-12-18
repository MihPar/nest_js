import { WithId } from "mongodb";
import mongoose from "mongoose";
import { Like } from "./likes.class";
import { LikeStatusEnum } from "./likes.emun";

export const LikesInfoSchema = new mongoose.Schema<WithId<Like>>({
  userId: { type: mongoose.Schema.Types.ObjectId, require: true },
  login: {type: String, require: true},
  commentId: { type: String, nullable: true },
  postId: { type: String, nullable: true },
  myStatus: {
    type: String,
    default: LikeStatusEnum.None,
    enum: ["None", "Like", "Dislike"],
  },
  addedAt: { type: String, require: true },
});