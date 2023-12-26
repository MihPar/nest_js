
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '../api/users/users.controller';
import { CommentsController } from '../api/comment/comments.controller';
import { BlogsController } from '../api/blogs/blogs.controller';
import { BlogsQueryRepository } from '../api/blogs/blogs.queryReposity';
import { BlogsService } from '../api/blogs/blogs.service';
import { PostsQueryRepository } from '../api/posts/postQuery.repository';
import { PostsService } from '../api/posts/posts.service';
import { BlogsRepository } from '../api/blogs/blogs.repository';
import { PostsRepository } from '../api/posts/posts.repository';
import { likesRepository } from '../api/likes/likes.repository';
import { CommentQueryRepository } from '../api/comment/comment.queryRepository';
import { CommentService } from '../api/comment/comment.service';
import { CommentRepository } from '../api/comment/comment.repository';
import { UsersQueryRepository } from '../api/users/users.queryRepository';
import { UserService } from '../api/users/user.service';
import { UsersRepository } from '../api/users/user.repository';
import { EmailManager } from '../api/manager/email.manager';
import { DeleteAllDataController } from '../api/delete/delete.allData';
import { PostController } from '../api/posts/post.controller';
import { PostClass, PostModel} from '../schema/post.schema';
import { LikeClass, LikeSchema } from '../schema/likes.schema';
import { UserClass, UserSchema } from '../schema/user.schema';
import { CommentClass, CommentSchema } from '../schema/comment.schema';
import { BlogClass, BlogSchema } from '../schema/blogs.schema';

const blogsProviders = [
  BlogsQueryRepository,
  BlogsService,  
  BlogsRepository, 
  
];

const commentProviders = [
  CommentQueryRepository,
  CommentService,
  CommentRepository,
 
];
const postProviders = [
  PostsQueryRepository,  
  PostsService,  
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
    ConfigModule.forRoot(
		{
      isGlobal: true,
      envFilePath: '.env',
    }
	),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      PostModel,
      { name: LikeClass.name, schema: LikeSchema },
      { name: UserClass.name, schema: UserSchema },
      { name: CommentClass.name, schema: CommentSchema },
      { name: BlogClass.name, schema: BlogSchema },
    ]),
  ],
  controllers: [
    UsersController,
    PostController,
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
