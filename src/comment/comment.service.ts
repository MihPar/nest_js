import { LikeStatusEnum } from "src/likes/likes.emun";
import { CommentsDB } from "./comment.class";
import { CommentRepositories } from "./comment.repository";

export class CommentService {
  constructor(protected commentRepositories: CommentRepositories) {}
  async createNewCommentByPostId(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ) {
    const newComment: CommentsDB = new CommentsDB(content, postId, {
      userId,
      userLogin,
    });
    const createNewCommentawait: CommentsDB =
      await this.commentRepositories.createNewCommentPostId(newComment);
    return createNewCommentawait.getNewComment(LikeStatusEnum.None);
  }
}