import { likesRepository } from './../likes/likes.repository';
import { LikeStatusEnum } from "src/api/likes/likes.emun";
import { CommentsDB } from "./comment.class";
import { CommentRepository } from "./comment.repository";
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class CommentService {
  constructor(
	protected commentRepositories: CommentRepository,
	protected likesRepositories: likesRepository
	) {}
  async deleteAllComments() {
	return await this.commentRepositories.deleteAllComments();
  }
}