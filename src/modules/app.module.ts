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
import { JwtModule } from '@nestjs/jwt';
import { DeviceClass, DeviceSchema } from '../schema/device.schema';
import { SecurityDeviceController } from '../api/securityDevices/device.controller';
import { DeviceQueryRepository } from '../api/securityDevices/deviceQuery.repository';
import { DeviceService } from '../api/securityDevices/device.service';
import { DeviceRepository } from '../api/securityDevices/device.repository';
import { IPCollectionClass, IPCollectionSchema } from '../schema/IP.Schema';
import { AuthBasic } from '../infrastructure/guards/auth/basic.auth';
import { CheckRefreshTokenFindMe } from '../infrastructure/guards/auth/checkFindMe';
import { CheckRefreshToken } from '../infrastructure/guards/auth/checkRefreshToken';
import { Ratelimits } from '../infrastructure/guards/auth/rateLimits';
import { RatelimitsRegistration } from '../infrastructure/guards/auth/rateLimitsRegistration';
import { CheckRefreshTokenForComments } from '../infrastructure/guards/comments/bearer.authForComments';
import { CheckRefreshTokenForGetComments } from '../infrastructure/guards/comments/bearer.authGetComment';
import { CheckRefreshTokenForPost } from '../infrastructure/guards/post/bearer.authForPost';
import { ForbiddenCalss } from '../infrastructure/guards/securityDevice.ts/forbidden';
import { AppService } from '../app.service';
import { AuthController } from '../api/auth/auth.controller';
import { CheckLoginOrEmail } from '../infrastructure/guards/auth/checkEmailOrLogin';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { RecoveryPasswordUseCase } from '../api/users/use-case/recoveryPassowrd-use-case';
import { NewPasswordUseCase } from '../api/users/use-case/createNewPassword-use-case';
import { CreateDeviceUseCase } from '../api/securityDevices/use-case/createDevice-use-case';
import { CreateLoginUseCase } from '../api/users/use-case/createLogin-use-case';
import { RefreshTokenUseCase } from '../api/auth/use-case/refreshToken-use-case';
import { RegistrationConfirmationUseCase } from '../api/users/use-case/registratinConfirmation-use-case';
import { RegistrationUseCase } from '../api/users/use-case/registration-use-case';
import { UpdateBlogCase } from '../api/blogs/use-case/updateBlog-use-case';
import { CreateNewBlogUseCase } from '../api/blogs/use-case/createNewBlog-use-case';
import { GetUserIdByTokenUseCase } from '../api/auth/use-case/getUserIdByToken-use-case';
import { PayloadAdapter } from '../api/adapter/payload.adapter';
import { UpdateCommentByCommentIdUseCase } from '../api/comment/use-case/updateCommentByCommentId-use-case';
import { DeleteAllPostsCase } from '../api/posts/use-case/deleteAllPosts-use-case';
import { DeleteAllBlogsCase } from '../api/blogs/use-case/deletAllBlogs-use-case';
import { DeleteAllUsersCase } from '../api/users/use-case/deleteAllUsers-use-case';
import { DeleteAllCommentsCase } from '../api/comment/use-case/deleteAllComments-use-case';
import { DeleteAllLikesCase } from '../api/likes/use-case/deleteAllLikes-use-case';
import { UpdateLikeStatusUseCase } from '../api/posts/use-case/updateLikeStatus-use-case';
import { GenerateHashAdapter } from '../api/adapter/generateHashAdapter';
import { CreateNewCommentByPostIdCase } from '../api/comment/use-case/createNewCommentByPotsId-use-case';
import { CreatePostCase } from '../api/posts/use-case/createPost-use-case';
import { UpdateOldPostCase } from '../api/posts/use-case/updateOldPost-use-case';
import { DeletePostByIdCase } from '../api/posts/use-case/deletePostById-use-case';
import { TerminateAllCurrentSessionCase } from '../api/securityDevices/use-case/terminateAllCurrentSeccion-use-case';
import { CreateNewUserCase } from '../api/users/use-case/createNewUser-use-case';
import { DeleteUserByIdCase } from '../api/users/use-case/deleteUserById-use-case';
import { CreateNewPostForBlogUseCase } from '../api/blogs/use-case/createNewPostForBlog-use-case';
import { UpdateDeviceUseCase } from '../api/securityDevices/use-case/updateDevice-use-case';
import { RegistrationEmailResendingUseCase } from '../api/users/use-case/registrationEmailResending-use-case';
import { LogoutUseCase } from '../api/securityDevices/use-case/logout-use-case';
import { UpdateLikestatusUseCase } from '../api/comment/use-case/updateLikeStatus-use-case';
import { IsConfirmed } from '../infrastructure/guards/auth/isCodeConfirmed';
import { IsExistEmailUser } from '../infrastructure/guards/auth/isExixtEmailUser';

const useCase = [
  RecoveryPasswordUseCase,
  NewPasswordUseCase,
  CreateLoginUseCase,
  CreateDeviceUseCase,
  RefreshTokenUseCase,
  RegistrationConfirmationUseCase,
  RegistrationUseCase,
  UpdateBlogCase,
  CreateNewBlogUseCase,
  GetUserIdByTokenUseCase,
  UpdateCommentByCommentIdUseCase,
  DeleteAllPostsCase,
  DeleteAllBlogsCase,
  DeleteAllUsersCase,
  DeleteAllCommentsCase,
  DeleteAllLikesCase,
  UpdateLikeStatusUseCase,
  CreateNewCommentByPostIdCase,
  CreatePostCase,
  UpdateOldPostCase,
  DeletePostByIdCase,
  TerminateAllCurrentSessionCase,
  CreateNewUserCase,
  DeleteUserByIdCase,
  CreateNewPostForBlogUseCase,
  UpdateDeviceUseCase,
  RegistrationEmailResendingUseCase,
  LogoutUseCase,
  UpdateLikestatusUseCase,
];

const services = [
  BlogsService,
  CommentService,
  LikesService,
  PostsService,
  DeviceService,
  UsersService,
  AppService,
];
const guards = [
  AuthBasic,
  CheckRefreshTokenFindMe,
  CheckRefreshToken,
  CheckLoginOrEmail,
  Ratelimits,
  RatelimitsRegistration,
  CheckRefreshTokenForComments,
  CheckRefreshTokenForGetComments,
  CheckRefreshTokenForPost,
  ForbiddenCalss,
  IsConfirmed,
  IsExistEmailUser
];
const reposponse = [
  BlogsQueryRepository,
  BlogsRepository,
  CommentQueryRepository,
  CommentRepository,
  LikesRepository,
  PostsQueryRepository,
  PostsRepository,
  DeviceRepository,
  DeviceQueryRepository,
  UsersRepository,
  UsersQueryRepository,
];
const adapter = [EmailAdapter, PayloadAdapter, GenerateHashAdapter];
const manager = [EmailManager];

@Module({
  imports: [
	CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
	PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600s' },
    }),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'),
    MongooseModule.forFeature([
      { name: PostClass.name, schema: PostSchema },
      { name: LikeClass.name, schema: LikeSchema },
      { name: UserClass.name, schema: UserSchema },
      { name: CommentClass.name, schema: CommentSchema },
      { name: BlogClass.name, schema: BlogSchema },
      { name: DeviceClass.name, schema: DeviceSchema },
      { name: IPCollectionClass.name, schema: IPCollectionSchema },
    ]),
  ],
  controllers: [
    UsersController,
    PostController,
    CommentsController,
    BlogsController,
    DeleteAllDataController,
    SecurityDeviceController,
    // AppController,
	AuthController
  ],
  providers: [
  ...services, ...guards, ...reposponse, ...adapter, ...manager, ...useCase],
})
export class AppModule {}


// mongodb+srv://MihPar:MihPar1981@cluster0.e2lfxsd.mongodb.net/?retryWrites=true&w=majo