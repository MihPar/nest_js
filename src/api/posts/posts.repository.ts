import { BlogDocument } from './../../schema/blogs.schema';
import { PostsModel } from "src/db/db";
import { PostsDB } from "./posts.class";
import { ObjectId } from "mongodb";
import { LikeStatusEnum } from "src/api/likes/likes.emun";

// export class PostsRepository {
//   async createNewPosts(newPost: PostsDB) {
//     const result = await PostsModel.create(newPost);
//     return newPost;
//   }
//   async updatePost(
//     id: string,
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//   ) {
//     const result = await PostsModel.updateOne(
//       { _id: new ObjectId(id) },
//       {
//         $set: {
//           title: title,
//           shortDescription: shortDescription,
//           content: content,
//           blogId: blogId,
//         },
//       },
//     );
//     return result.matchedCount === 1;
//   }

//   async increase(postId: string, likeStatus: string) {
//     if (likeStatus === LikeStatusEnum.None) {
//       return;
//     }
//     return await PostsModel.updateOne(
//       { _id: new ObjectId(postId) },
//       {
//         $inc:
//           likeStatus === 'Dislike'
//             ? { 'extendedLikesInfo.dislikesCount': 1 }
//             : { 'extendedLikesInfo.likesCount': 1 },
//       },
//     );
//   }

//   async decrease(postId: string, likeStatus: string) {
//     if (likeStatus === LikeStatusEnum.None) {
//       return;
//     }
//     return await PostsModel.updateOne(
//       { _id: new ObjectId(postId) },
//       {
//         $inc:
//           likeStatus === 'Dislike'
//             ? { 'extendedLikesInfo.dislikesCount': -1 }
//             : { 'extendedLikesInfo.likesCount': -1 },
//       },
//     );
//   }

//   async deletedPostById(id: string) {
//     const result = await PostsModel.deleteOne({ _id: new ObjectId(id) });
//     return result.deletedCount === 1;
//   }

//   async deleteRepoPosts() {
// 	const deletedAll = await PostsModel.deleteMany({});
//     return deletedAll.acknowledged;
//   }
// }



import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {  PostClass, PostDocument } from '../../schema/post.schema';
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostsRepository {
  constructor(
	@InjectModel(PostClass.name) private postModel: Model<PostDocument>
	) {}

async createNewPosts(newPost: PostsDB): Promise<PostsDB> {
    const result = new this.postModel(newPost);
    const doc = await result.save()
	return await this.postModel.findById(doc.id);
  }

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ) {
    const result = await this.postModel.findByIdAndUpdate(id, {title, shortDescription, content, blogId, ''})
    return result.updateOne();
  }

  async increase(postId: string, likeStatus: string) {
    if (likeStatus === LikeStatusEnum.None) {
      return;
    }
    const result = new this.postModel(postId, likeStatus)
	return result.increment()
  }

  async decrease(postId: string, likeStatus: string) {
    if (likeStatus === LikeStatusEnum.None) {
      return;
    }
    const result = new this.postModel(postId, likeStatus)
	return result.decriment()
  }

  async deletedPostById(id: string) {
    const result = new this.postModel({ _id: new ObjectId(id) });
    return result.deleteOne()
  }

  async deleteRepoPosts() {
	const deletedAll = new this.postModel();
    return deletedAll.deleteOne()
  }
 
}