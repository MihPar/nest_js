import { Module, Post } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { likesRepository } from 'src/api/likes/likes.repository';
import { PostSchema } from 'src/api/posts/post.schema';

@Module({
  imports: [
	MongooseModule.forRoot('mongodb://localhost/nest'),
	MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])
],
  controllers: [],
  providers: [likesRepository],
})
export class PostModule {}
