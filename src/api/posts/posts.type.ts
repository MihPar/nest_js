import { LikesInfoViewModel } from "src/api/likes/likes.type";

export type PostsViewModel = {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: string;
	extendedLikesInfo: LikesInfoViewModel,
  };

  export type inputModelPostType = {
	title: string
	shortDescription: string
	content: string
	blogId: string
  }

  export type bodyPostsModel = {
	title: string
	shortDescription: string
	content: string
}