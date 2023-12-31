import { CommentRepository } from "./comment.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CommentService {
  constructor(
	protected commentRepositories: CommentRepository,
	) {}
  async deleteAllComments() {
	return await this.commentRepositories.deleteAllComments();
  }
}