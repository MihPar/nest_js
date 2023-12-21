import { PostController } from 'src/api/posts/post.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostClass, PostSchema } from 'src/schema/post.schema';
import { PostsQueryRepository } from 'src/api/posts/postQuery.repository';
import { CommentQueryRepository } from 'src/api/comment/comment.queryRepository';
import { CommentService } from 'src/api/comment/comment.service';
import { PostsService } from 'src/api/posts/posts.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGOOSE_DB_NAME,
      // loggerLevel: 'debug'
    }),
    MongooseModule.forFeature([{ name: PostClass.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostsQueryRepository, CommentQueryRepository, CommentService, PostsService],
})
export class AppModule {}
