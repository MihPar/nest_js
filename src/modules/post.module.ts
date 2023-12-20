import { PostController } from 'src/api/posts/post.controller';
import { Module, Post } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/api/posts/post.schema';

@Module({
  imports: [
	MongooseModule.forRoot('mongodb://localhost/nest'),
	MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])
],
  controllers: [],
  providers: [PostController],
})
export class PostModule {}
