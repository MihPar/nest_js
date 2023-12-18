import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { LikesModel, PostsModel } from "src/db/db";
import { LikeStatusEnum } from "src/likes/likes.emun";
import { Posts, PostsDB } from "./posts.class";
import { PaginationType } from "src/types/pagination.types";

@Injectable()
export class PostsQueryRepositories {
  async findPostById(postId: string, userId?: string) {
    const post = await PostsModel.findOne(
      { _id: new ObjectId(postId) },
      { __v: 0 },
    ).lean();
    const newestLikes = await LikesModel.find({
      postId,
      myStatus: LikeStatusEnum.Like,
    })
      .sort({ addedAt: -1 })
      .limit(3)
      .skip(0)
      .lean();
    let myStatus: LikeStatusEnum = LikeStatusEnum.None;
    if (userId) {
      const reaction = await LikesModel.findOne({
        postId,
        userId: new ObjectId(userId),
      });
      myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None;
    }
    return post ? PostsDB.getPostsViewModel(post, myStatus, newestLikes) : null;
  }
  async findAllPosts(
	pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
	userId: ObjectId
	) {
		const filtered = {};
    const allPosts: PostsDB[] = await PostsModel.find(filtered, {__v: 0 })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount: number = await PostsModel.countDocuments(filtered);
    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    let result: PaginationType<Posts> = {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: await Promise.all(allPosts.map(async(post) => {
		const newestLikes = await LikesModel
		.find({postId: new ObjectId(post._id), myStatus: LikeStatusEnum.Like})
		.sort({addedAt: -1})
		.limit(3)
		.skip(0)
		.lean()
		let myStatus : LikeStatusEnum = LikeStatusEnum.None;
		if(userId){
			const reaction = await LikesModel.findOne({postId: new ObjectId(post._id), userId: new ObjectId(userId)}, {__v: 0}).lean()
			myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None
		}			
		return PostsDB.getPostsViewModel(post, myStatus, newestLikes)
	}))};
    return result;
	}
}