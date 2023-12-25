// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { CommentClass, CommentSchema } from 'src/schema/comment.schema';
// import { CommentsController } from 'src/api/comment/comments.controller';
// import { CommentQueryRepository } from 'src/api/comment/comment.queryRepository';
// import { CommentService } from 'src/api/comment/comment.service';
// import { CommentRepository } from 'src/api/comment/comment.repository';
// import { LikeClass, LikeSchema } from 'src/schema/likes.schema';
// import { likesRepository } from 'src/api/likes/likes.repository';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
// 		{ name: CommentClass.name, schema: CommentSchema },
// 		{ name: LikeClass.name, schema: LikeSchema },
// 	]),
//   ],
//   controllers: [CommentsController],
//   providers: [CommentQueryRepository, CommentService, CommentRepository, likesRepository],
// })
// export class CommentModule {}
