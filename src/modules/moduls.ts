import { PostController } from 'src/api/posts/post.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostClass, PostSchema } from 'src/schema/post.schema';
import { LikeClass, LikeSchema } from 'src/schema/likes.schema';
import { UserClass, UserSchema } from 'src/schema/user.schema';
import { CommentClass, CommentSchema } from 'src/schema/comment.schema';
import { BlogClass, BlogSchema } from 'src/schema/blogs.schema';
import { UsersController } from 'src/api/users/users.controller';
import { CommentsController } from 'src/api/comment/comments.controller';
import { BlogsController } from 'src/api/blogs/blogs.controller';
import { ConfigModule } from '@nestjs/config';
import { BlogsQueryRepository } from 'src/api/blogs/blogs.queryReposity';
import { BlogsService } from 'src/api/blogs/blogs.service';
import { PostsQueryRepository } from 'src/api/posts/postQuery.repository';
import { PostsService } from 'src/api/posts/posts.service';
import { BlogsRepository } from 'src/api/blogs/blogs.repository';
import { PostsRepository } from 'src/api/posts/posts.repository';
import { likesRepository } from 'src/api/likes/likes.repository';
import { CommentQueryRepository } from 'src/api/comment/comment.queryRepository';
import { CommentService } from 'src/api/comment/comment.service';
import { CommentRepository } from 'src/api/comment/comment.repository';
import { UsersQueryRepository } from 'src/api/users/users.queryRepository';
import { UserService } from 'src/api/users/user.service';
import { UsersRepository } from 'src/api/users/user.repository';
import { EmailManager } from 'src/api/manager/email.manager';
import { DeleteAllDataController } from 'src/api/delete/delete.allData';

const blogsProviders = [
  BlogsQueryRepository,
  BlogsService,
  PostsQueryRepository,
  PostsService,
  BlogsRepository,
  PostsRepository,
  likesRepository,
];

const commentProviders = [
  CommentQueryRepository,
  CommentService,
  CommentRepository,
  likesRepository,
];
const postProviders = [
  PostsQueryRepository,
  CommentQueryRepository,
  CommentService,
  PostsService,
  CommentRepository,
  likesRepository,
  PostsRepository,
];
const userProviders = [
  UsersQueryRepository,
  UserService,
  UsersRepository,
  EmailManager,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGOOSE_DB_NAME,
      //   loggerLevel: 'debug'
    }),
    MongooseModule.forFeature([
    //   { name: PostClass.name, schema: PostSchema },
      { name: LikeClass.name, schema: LikeSchema },
      { name: UserClass.name, schema: UserSchema },
      { name: CommentClass.name, schema: CommentSchema },
      { name: BlogClass.name, schema: BlogSchema },
    ]),
  ],
  controllers: [
    UsersController,
    // PostController,
    CommentsController,
    BlogsController,
	DeleteAllDataController
  ],
  providers: [
    ...blogsProviders,
    ...commentProviders,
    likesRepository,
    ...postProviders,
    ...userProviders,
  ],
})
export class AppModule {}
