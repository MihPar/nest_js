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
import { CheckRefreshTokenForGet } from '../infrastructure/guards/comments/bearer.authGetComment';
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
import { UpdateBlogCommand, UpdateBlogUseCase } from '../api/blogs/use-case/updateBlog-use-case';
import { CreateNewBlogUseCase } from '../api/blogs/use-case/createNewBlog-use-case';
import { GetUserIdByTokenUseCase } from '../api/auth/use-case/getUserIdByToken-use-case';
import { PayloadAdapter } from '../api/adapter/payload.adapter';
import { UpdateCommentByCommentIdUseCase } from '../api/comment/use-case/updateCommentByCommentId-use-case';
import { DeleteAllPostsUseCase } from '../api/posts/use-case/deleteAllPosts-use-case';
import { DeleteAllBlogsUseCase } from '../api/blogs/use-case/deletAllBlogs-use-case';
import { DeleteAllUsersUseCase } from '../api/users/use-case/deleteAllUsers-use-case';
import { DeleteAllCommentsUseCase } from '../api/comment/use-case/deleteAllComments-use-case';
import { DeleteAllLikesUseCase } from '../api/likes/use-case/deleteAllLikes-use-case';
import { UpdateLikeStatusUseCase } from '../api/posts/use-case/updateLikeStatus-use-case';
import { GenerateHashAdapter } from '../api/adapter/generateHashAdapter';
import { CreateNewCommentByPostIdCommnad, CreateNewCommentByPostIdUseCase } from '../api/comment/use-case/createNewCommentByPotsId-use-case';
import { CreatePostUseCase } from '../api/posts/use-case/createPost-use-case';
import { UpdateOldPostUseCase } from '../api/posts/use-case/updateOldPost-use-case';
import { DeletePostByIdUseCase } from '../api/posts/use-case/deletePostById-use-case';
import { TerminateAllCurrentSessionUseCase } from '../api/securityDevices/use-case/terminateAllCurrentSeccion-use-case';
import { CreateNewUserUseCase } from '../api/users/use-case/createNewUser-use-case';
import { DeleteUserByIdUseCase } from '../api/users/use-case/deleteUserById-use-case';
import { CreateNewPostForBlogUseCase } from '../api/blogs/use-case/createNewPostForBlog-use-case';
import { UpdateDeviceUseCase } from '../api/securityDevices/use-case/updateDevice-use-case';
import { RegistrationEmailResendingUseCase } from '../api/users/use-case/registrationEmailResending-use-case';
import { LogoutUseCase } from '../api/securityDevices/use-case/logout-use-case';
import { UpdateLikestatusUseCase } from '../api/comment/use-case/updateLikeStatus-use-case';
import { IsConfirmed } from '../infrastructure/guards/auth/isCodeConfirmed';
import { IsExistEmailUser } from '../infrastructure/guards/auth/isExixtEmailUser';
import { IsBlogExistConstraint } from '../infrastructure/guards/post/pipe/blogIsExistDecorator';
import { authMiddleware } from '../infrastructure/guards/comments/checkRefreshTokenForComments';
import { ApiJwtModule } from './jwtModule';
import { ApiJwtService } from '../api/jwt/jwt.service';
import { ApiConfigService } from '../infrastructure/config/configService';
import { ConfigType } from '../infrastructure/config/configServiceType';

const useCase = [
  UpdateBlogUseCase,
  RecoveryPasswordUseCase,
  NewPasswordUseCase,
  CreateLoginUseCase,
  CreateDeviceUseCase,
  RefreshTokenUseCase,
  RegistrationConfirmationUseCase,
  RegistrationUseCase,
  UpdateBlogCommand,
  CreateNewBlogUseCase,
  GetUserIdByTokenUseCase,
  UpdateCommentByCommentIdUseCase,
  DeleteAllPostsUseCase,
  DeleteAllBlogsUseCase,
  DeleteAllUsersUseCase,
  DeleteAllCommentsUseCase,
  DeleteAllLikesUseCase,
  UpdateLikeStatusUseCase,
  CreateNewCommentByPostIdUseCase,
  CreateNewCommentByPostIdCommnad,
  CreatePostUseCase,
  UpdateOldPostUseCase,
  DeletePostByIdUseCase,
  TerminateAllCurrentSessionUseCase,
  CreateNewUserUseCase,
  DeleteUserByIdUseCase,
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
  JwtService,
//   JWTService,
  ApiConfigService,
  ConfigType,
  ApiJwtService
];
const guards = [
  AuthBasic,
  CheckRefreshTokenFindMe,
  CheckRefreshToken,
  CheckLoginOrEmail,
  Ratelimits,
  RatelimitsRegistration,
  CheckRefreshTokenForComments,
  CheckRefreshTokenForGet,
  CheckRefreshTokenForPost,
  ForbiddenCalss,
  IsConfirmed,
  IsExistEmailUser,
  authMiddleware
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
const pipe = [IsBlogExistConstraint]
const adapter = [EmailAdapter, PayloadAdapter, GenerateHashAdapter];
const manager = [EmailManager];

@Module({
  imports: [
	ApiJwtModule,
	// ApiConfigModule,
	CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
	// PassportModule,
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: '600s' },
    // }),
	// ThrottlerModule.forRoot([{
	// 	ttl: 60000,
	// 	limit: 10,
	//   }]),
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
	AuthController
  ],
  providers: [
  ...services, ...guards, ...reposponse, ...adapter, ...manager, ...useCase, ...pipe],
})
export class AppModule {}


// mongodb+srv://MihPar:MihPar1981@cluster0.e2lfxsd.mongodb.net/?retryWrites=true&w=majo