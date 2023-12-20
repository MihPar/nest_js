// import mongoose from 'mongoose'
// import { WithId } from 'mongodb'
// import { PostsDB } from './posts.class'

// export const PostSchema = new mongoose.Schema<WithId<PostsDB>>({
// 	title: {type: String, require: true},
// 	shortDescription: {type: String, require: true},
// 	content: {type: String, require: true},
// 	blogId: {type: String, require: true},
// 	blogName: {type: String, require: true},
// 	createdAt: {type: String, require: true},
// 	extendedLikesInfo: {
// 		likesCount: {type: Number, require: true},
// 		dislikesCount: {type: Number, require: true},
// 	  }
// })


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<PostClass>;

@Schema()
export class PostClass {
  @Prop({
	required: true
  })
  title: string;

  @Prop({
	required: true
  })
  shortDescription: number;

  @Prop({
	required: true
  })
  content: string;

  @Prop({
	required: true
  })
  blogId: string;

  @Prop({
	required: true
  })
  blogName: string;

  @Prop({
	required: true
  })
  createdAt: string;

  @Prop({
	required: true
  })
  extendedLikesInfo: {
	likesCount: {type: Number, require: true},
	dislikesCount: {type: Number, require: true},
  }

}

export const PostSchema = SchemaFactory.createForClass(PostClass);