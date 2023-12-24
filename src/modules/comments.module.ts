import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentClass, CommentSchema } from 'src/schema/comment.schema';
import { CommentsController } from 'src/api/comment/comments.controller';
import { CommentQueryRepository } from 'src/api/comment/comment.queryRepository';
import { CommentService } from 'src/api/comment/comment.service';
import { CommentRepository } from 'src/api/comment/comment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CommentClass.name, schema: CommentSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentQueryRepository, CommentService, CommentRepository,],
})
export class CommentModule {}
