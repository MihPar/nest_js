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
import { UsersController } from 'src/api/users/users.controller';
import { SecurityDevice } from 'src/api/securityDevices/device.controller';
import { CommentsController } from 'src/api/comment/comments.controller';
import { BlogsController } from 'src/api/blogs/blogs.controller';
import { BlogsQueryRepository } from 'src/api/blogs/blogs.queryReposity';
import { BlogsService } from 'src/api/blogs/blogs.service';
import { PostsService } from 'src/api/posts/posts.service';
import { BlogsRepository } from 'src/api/blogs/blogs.repository';
import { PostsQueryRepository } from 'src/api/posts/postQuery.repository';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGOOSE_DB_NAME,
      // loggerLevel: 'debug'
    }),
    MongooseModule.forFeature([
      { name: BlogClass.name, schema: BlogSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsQueryRepository, BlogsService, PostsQueryRepository, PostsService, BlogsRepository],
})
export class AppModule {}
