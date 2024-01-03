import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Posts, PostsDB } from './posts.class';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeStatusEnum } from '../likes/likes.emun';
import { PostClass, PostDocument } from '../../schema/post.schema';
import { PaginationType } from '../../types/pagination.types';
import { LikeClass, LikeDocument } from '../../schema/likes.schema';


@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(PostClass.name) private postModel: Model<PostDocument>,
    @InjectModel(LikeClass.name) private likeModel: Model<LikeDocument>,
  ) {}

  async findPostById(id: string, userId?: string): Promise<Posts | null> {
    const post: PostsDB | null = await this.postModel
      .findOne({ _id: new ObjectId(id) }, { __v: 0 })
      .lean();
    const newestLikes = await this.likeModel
      .find({ postId: id, myStatus: LikeStatusEnum.Like })
      .sort({ addedAt: -1 })
      .limit(3)
      .skip(0)
      .lean();
    let myStatus: LikeStatusEnum = LikeStatusEnum.None;
    if (userId) {
      const reaction = await this.likeModel.findOne({
        postId: id,
        userId: new ObjectId(userId),
      });
      myStatus = reaction
        ? (reaction.myStatus as unknown as LikeStatusEnum)
        : LikeStatusEnum.None;
    }
    return post ? PostsDB.getPostsViewModel(post, myStatus, newestLikes) : null;
  }

  async findAllPosts(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    userId: string,
  ): Promise<PaginationType<Posts>> {
    const filtered = {};
    const allPosts: PostsDB[] = await this.postModel
      .find(filtered, { __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount: number = await this.postModel.countDocuments(filtered);
    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    let result: PaginationType<Posts> = {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: await Promise.all(
        allPosts.map(async (post) => {
          const newestLikes = await this.likeModel
            .find({
              postId: new ObjectId(post._id),
              myStatus: LikeStatusEnum.Like,
            })
            .sort({ addedAt: -1 })
            .limit(3)
            .skip(0)
            .lean();
          let myStatus: LikeStatusEnum = LikeStatusEnum.None;
          if (userId) {
            const reaction = await this.likeModel
              .findOne(
                {
                  postId: new ObjectId(post._id),
                  userId: new ObjectId(userId),
                },
                { __v: 0 },
              )
              .lean();
            myStatus = reaction
              ? (reaction.myStatus as unknown as LikeStatusEnum)
              : LikeStatusEnum.None;
          }
          return PostsDB.getPostsViewModel(post, myStatus, newestLikes);
        }),
      ),
    };
    return result;
  }

  async findPostsByBlogsId(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    blogId: string,
    userId: string,
  ): Promise<PaginationType<Posts>> {
    const filter = { blogId: new ObjectId(blogId) };
    const posts: PostsDB[] = await this.postModel
      .find(filter, { __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();
    const totalCount: number = await this.postModel.countDocuments(filter);
    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    const result: PaginationType<Posts> = {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: await Promise.all(
        posts.map(async (post) => {
          const newestLikes = await this.likeModel
            .find({
              postId: post._id.toString(),
              myStatus: LikeStatusEnum.Like,
            })
            .sort({ addedAt: -1 })
            .limit(3)
            .skip(0)
            .lean();
          let myStatus: LikeStatusEnum = LikeStatusEnum.None;
          if (userId) {
            const reaction = await this.likeModel
              .findOne({
                postId: post._id.toString(),
                userId: new ObjectId(userId),
              })
              .lean();
            myStatus = reaction
              ? (reaction.myStatus as unknown as LikeStatusEnum)
              : LikeStatusEnum.None;
          }
          return PostsDB.getPostsViewModel(post, myStatus, newestLikes);
        }),
      ),
    };
    return result;
  }
}