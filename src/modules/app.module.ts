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
import { LikesRepository } from '../api/likes/likes.repository';
import { CommentQueryRepository } from '../api/comment/comment.queryRepository';
import { CommentService } from '../api/comment/comment.service';
import { CommentRepository } from '../api/comment/comment.repository';
import { UsersQueryRepository } from '../api/users/users.queryRepository';
import { UsersRepository } from '../api/users/user.repository';
import { EmailManager } from '../api/manager/email.manager';
import { DeleteAllDataController } from '../api/delete/delete.allData';
import { PostController } from '../api/posts/post.controller';
import { LikeClass, LikeSchema } from '../schema/likes.schema';
import { UserClass, UserSchema } from '../schema/user.schema';
import { CommentClass, CommentSchema } from '../schema/comment.schema';
import { BlogClass, BlogSchema } from '../schema/blogs.schema';
import { PostClass, PostSchema } from '../schema/post.schema';
import { LikesService } from '../api/likes/likes.service';
import { UsersService } from '../api/users/user.service';
import { EmailAdapter } from '../api/adapter/email.adapter';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DeviceClass, DeviceSchema } from '../schema/device.schema';
import { SecurityDevice } from '../api/securityDevices/device.controller';
import { DeviceQueryRepository } from '../api/securityDevices/deviceQuery.repository';
import { DeviceService } from '../api/securityDevices/device.service';
import { DeviceRepository } from '../api/securityDevices/device.repository';


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
  PostsRepository,
];
const userProviders = [
  UsersQueryRepository,
  UsersService,
  UsersRepository,
  EmailManager,
  EmailAdapter
];
const deviceProviders = [DeviceQueryRepository, JwtService,  DeviceService, DeviceRepository,]

@Module({
  imports: [
    ConfigModule.forRoot(
		{
      isGlobal: true,
      envFilePath: '.env',
    }
	),
	JwtModule.register({
		secret: process.env.JWT_SECRET, 
		signOptions: { expiresIn: '600s' }, 
	}),
    MongooseModule.forRoot(process.env.MONGO_URL || "mongodb://0.0.0.0:27017"),
    MongooseModule.forFeature([
	  { name: PostClass.name, schema: PostSchema },
      { name: LikeClass.name, schema: LikeSchema },
      { name: UserClass.name, schema: UserSchema },
      { name: CommentClass.name, schema: CommentSchema },
      { name: BlogClass.name, schema: BlogSchema },
	  { name: DeviceClass.name, schema: DeviceSchema}
    ]),
  ],
  controllers: [
    UsersController,
    PostController,
    CommentsController,
    BlogsController,
	DeleteAllDataController,
	SecurityDevice
  ],
  providers: [
    ...blogsProviders,
    ...commentProviders,
    LikesRepository,
	LikesService,
    ...postProviders,
    ...userProviders,
	...deviceProviders
  ],
})
export class AppModule {}


// mongodb+srv://MihPar:MihPar1981@cluster0.e2lfxsd.mongodb.net/?retryWrites=true&w=majo