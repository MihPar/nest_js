import { PostsDB } from './posts.class';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PostClass, PostDocument } from '../../schema/post.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(PostClass.name) private postModel: Model<PostDocument>,
  ) {}

  async createNewPosts(newPost: PostsDB): Promise<PostsDB> {
    const result = await this.postModel.create(newPost);
    return newPost;
  }

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    const result = await this.postModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
        },
      },
    );
    return result.matchedCount === 1;
  }

  async deletedPostById(id: string): Promise<boolean> {
    const result = await this.postModel.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async deleteRepoPosts() {
    const deletedAll = await this.postModel.deleteMany({});
    return deletedAll.deletedCount === 1;
  }
}
