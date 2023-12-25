// import { PostController } from 'src/api/posts/post.controller';
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PostClass, PostSchema } from 'src/schema/post.schema';
// import { PostsQueryRepository } from 'src/api/posts/postQuery.repository';
// import { CommentQueryRepository } from 'src/api/comment/comment.queryRepository';
// import { CommentService } from 'src/api/comment/comment.service';
// import { PostsService } from 'src/api/posts/posts.service';
// import { LikeClass, LikeSchema } from 'src/schema/likes.schema';
// import { CommentClass, CommentSchema } from 'src/schema/comment.schema';
// import { CommentRepository } from 'src/api/comment/comment.repository';
// import { likesRepository } from 'src/api/likes/likes.repository';
// import { PostsRepository } from 'src/api/posts/posts.repository';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
// 		{ name: PostClass.name, schema: PostSchema },
// 		{ name: LikeClass.name, schema: LikeSchema },
// 		{ name: CommentClass.name, schema: CommentSchema }
// 	]),
//   ],
//   controllers: [PostController],
//   providers: [PostsQueryRepository, CommentQueryRepository, CommentService, PostsService, CommentRepository, likesRepository, PostsRepository],
// })
// export class PostsModule {}
