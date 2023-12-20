import { PostController } from 'src/api/posts/post.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostClass, PostSchema } from 'src/schema/post.schema';
import { LikeClass, LikeSchema } from 'src/schema/likes.schema';
import { UserClass, UserSchema } from 'src/schema/user.schema';
import { DeviceClass, DeviceSchema } from 'src/schema/device.schema';
import { CommentClass, CommentSchema } from 'src/schema/comment.schema';
import { BlogClass, BlogSchema } from 'src/schema/blogs.schema';
import { IPCollectionClass, IPCollectionSchema } from 'src/schema/api.collection.schema';

@Module({
  imports: [
	MongooseModule.forRoot(process.env.MONGO_URL, {
		dbName: process.env.MONGOOSE_DB_NAME,
		// loggerLevel: 'debug'
	}),
	MongooseModule.forFeature([
		{ name: PostClass.name, schema: PostSchema },
		{ name: LikeClass.name, schema: LikeSchema },
		{ name: UserClass.name, schema: UserSchema},
		{ name: DeviceClass.name, schema: DeviceSchema},
		{ name: CommentClass.name, schema: CommentSchema},
		{ name: BlogClass.name, schema: BlogSchema},
		{ name: IPCollectionClass.name, schema: IPCollectionSchema}
	])
],
  controllers: [],
  providers: [PostController],
})
export class AppModule {}
