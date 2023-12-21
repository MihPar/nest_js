import { PostsDB } from 'src/api/posts/posts.class';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { LikeStatusEnum } from 'src/api/likes/likes.emun';
import { Posts } from './posts.class';
import { PaginationType } from 'src/types/pagination.types';
import { InjectModel } from '@nestjs/mongoose';
import { PostClass, PostDocument } from 'src/schema/post.schema';
import { Model } from 'mongoose';
import { LikeClass, LikeDocument } from 'src/schema/likes.schema';

@Injectable()
export class PostsQueryRepository {
	constructor(
		@InjectModel(PostClass.name) private postModel: Model<PostDocument>,
		@InjectModel(LikeClass.name) private likeModel: Model<LikeDocument>
	) {}

	async findPostById(postId: string) {
		const post: PostsDB = await new this.postModel( { _id: new ObjectId(postId) },
		{ __v: 0 },)

		const newestLikes = new this.likeModel(postId, myStatus: LikeStatusEnum.Like,)
		.sort({ addedAt: -1 })
		.limit(3) 
		.skip(0)
		.lean();
	  let myStatus: LikeStatusEnum = LikeStatusEnum.None;
	//   if (userId) {
	// 	const reaction = new this.likeModel.find({ postId, userId: new ObjectId(userId)});
	// 	myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None;
	//   }
	  return PostsDB.getPostsViewModel(post, myStatus, newestLikes);
	}
//   async findPostById(postId: string, userId?: string) {
//     const post = await PostsModel.findOne(
//       { _id: new ObjectId(postId) },
//       { __v: 0 },
//     ).lean();
//     const newestLikes = await LikesModel.find({
//       postId,
//       myStatus: LikeStatusEnum.Like,
//     })
//       .sort({ addedAt: -1 })
//       .limit(3)
//       .skip(0)
//       .lean();
//     let myStatus: LikeStatusEnum = LikeStatusEnum.None;
//     if (userId) {
//       const reaction = await LikesModel.findOne({
//         postId,
//         userId: new ObjectId(userId),
//       });
//       myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None;
//     }
//     return post ? PostsDB.getPostsViewModel(post, myStatus, newestLikes) : null;
//   }

async fincdAllPost( pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    userId: ObjectId,) {
		const filtered = {};
		const allPosts: PostClass[] = await new this.postModel.find(filtered, { __v: 0 })
		  .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
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
		  items: await Promise.all(
			allPosts.map(async (post) => {
			  const newestLikes = await LikesModel.find({
				postId: new ObjectId(post._id),
				myStatus: LikeStatusEnum.Like,
			  })
				.sort({ addedAt: -1 })
				.limit(3)
				.skip(0)
				.lean();
			  let myStatus: LikeStatusEnum = LikeStatusEnum.None;
			  if (userId) {
				const reaction = await LikesModel.findOne(
				  { postId: new ObjectId(post._id), userId: new ObjectId(userId) },
				  { __v: 0 },
				).lean();
				myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None;
			  }
			  return this.postModel.getPostsViewModel(post, myStatus, newestLikes);
			}),
		  ),
		};
		return result;
	}
//   async findAllPosts(
//     pageNumber: string,
//     pageSize: string,
//     sortBy: string,
//     sortDirection: string,
//     userId: ObjectId,
//   ) {
//     const filtered = {};
//     const allPosts: PostsDB[] = await PostsModel.find(filtered, { __v: 0 })
//       .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
//       .skip((+pageNumber - 1) * +pageSize)
//       .limit(+pageSize)
//       .lean();

//     const totalCount: number = await PostsModel.countDocuments(filtered);
//     const pagesCount: number = Math.ceil(totalCount / +pageSize);

//     let result: PaginationType<Posts> = {
//       pagesCount: pagesCount,
//       page: +pageNumber,
//       pageSize: +pageSize,
//       totalCount: totalCount,
//       items: await Promise.all(
//         allPosts.map(async (post) => {
//           const newestLikes = await LikesModel.find({
//             postId: new ObjectId(post._id),
//             myStatus: LikeStatusEnum.Like,
//           })
//             .sort({ addedAt: -1 })
//             .limit(3)
//             .skip(0)
//             .lean();
//           let myStatus: LikeStatusEnum = LikeStatusEnum.None;
//           if (userId) {
//             const reaction = await LikesModel.findOne(
//               { postId: new ObjectId(post._id), userId: new ObjectId(userId) },
//               { __v: 0 },
//             ).lean();
//             myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None;
//           }
//           return PostsDB.getPostsViewModel(post, myStatus, newestLikes);
//         }),
//       ),
//     };
//     return result;
//   }

async findPostsByBlogsId(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    blogId: string
  ): Promise<PaginationType<Posts>> {
    const filter = { blogId: blogId };
    const posts: PostsDB[] = await this.postModel.find(filter, {__v: 0 })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize) //todo find how we can skip
      .limit(+pageSize)
      .lean();
    const totalCount: number = await this.postModel.countDocuments(filter);
    const pagesCount: number = Math.ceil(totalCount / +pageSize);

		const result: PaginationType<Posts> = {
		pagesCount: pagesCount,
		page: +pageNumber,
		pageSize: +pageSize,
		totalCount: totalCount,
		items: await Promise.all(posts.map(async(post)=> {
			const newestLikes = await LikesModel
			.find({postId: post._id.toString(), myStatus: LikeStatusEnum.Like})
			.sort({addedAt: -1})
			.limit(3)
			.skip(0)
			.lean()
			let myStatus : LikeStatusEnum = LikeStatusEnum.None;
		// 	if(userId){
		// 		const reaction = await LikesModel.findOne({postId: post._id.toString(), userId: new ObjectId(userId)}).lean()
		// 		console.log("reaction: ", reaction)
		// 		myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None
		// }			
			return PostsDB.getPostsViewModel(post, myStatus, newestLikes)
		}))
	  };

    return result
}
//   async findPostsByBlogsId(
//     pageNumber: string,
//     pageSize: string,
//     sortBy: string,
//     sortDirection: string,
//     blogId: string,
//     userId: string,
//   ): Promise<PaginationType<Posts>> {
//     const filter = { blogId: blogId };
//     const posts: PostsDB[] = await PostsModel.find(filter, { __v: 0 })
//       .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
//       .skip((+pageNumber - 1) * +pageSize) //todo find how we can skip
//       .limit(+pageSize)
//       .lean();
//     const totalCount: number = await PostsModel.countDocuments(filter);
//     const pagesCount: number = Math.ceil(totalCount / +pageSize);

//     const result: PaginationType<Posts> = {
//       pagesCount: pagesCount,
//       page: +pageNumber,
//       pageSize: +pageSize,
//       totalCount: totalCount,
//       items: await Promise.all(
//         posts.map(async (post) => {
//           const newestLikes = await LikesModel.find({
//             postId: post._id.toString(),
//             myStatus: LikeStatusEnum.Like,
//           })
//             .sort({ addedAt: -1 })
//             .limit(3)
//             .skip(0)
//             .lean();
//           let myStatus: LikeStatusEnum = LikeStatusEnum.None;
//           if (userId) {
//             const reaction = await LikesModel.findOne({
//               postId: post._id.toString(),
//               userId: new ObjectId(userId),
//             }).lean();
//             console.log('reaction: ', reaction);
//             myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None;
//           }
//           return PostsDB.getPostsViewModel(post, myStatus, newestLikes);
//         }),
//       ),
//     };

//     return result;
//   }
}
