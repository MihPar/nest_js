import { LikesRepository } from './../likes/likes.repository';
import { CommentsDB } from "./comment.class";
import { CommentRepository } from "./comment.repository";
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class CommentService {
  constructor(
	protected commentRepositories: CommentRepository,
	) {}
  async deleteAllComments() {
	return await this.commentRepositories.deleteAllComments();
  }
}