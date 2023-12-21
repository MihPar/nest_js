import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<PostClass>;

@Schema()
export class PostClass {
  _id: Types.ObjectId;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  shortDescription: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  blogId: string;

  @Prop({
    required: true,
  })
  blogName: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  extendedLikesInfo: {
    likesCount: { type: Number; require: true };
    dislikesCount: { type: Number; require: true };
  };
}

export const PostSchema = SchemaFactory.createForClass(PostClass);
