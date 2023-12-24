import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogClass, BlogSchema } from 'src/schema/blogs.schema';
import { BlogsController } from 'src/api/blogs/blogs.controller';
import { BlogsQueryRepository } from 'src/api/blogs/blogs.queryReposity';
import { BlogsService } from 'src/api/blogs/blogs.service';
import { PostsService } from 'src/api/posts/posts.service';
import { BlogsRepository } from 'src/api/blogs/blogs.repository';
import { PostsQueryRepository } from 'src/api/posts/postQuery.repository';
import {ConfigModule} from '@nestjs/config'

@Module({
  imports: [
	ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
	// ProductsModule,
    MongooseModule.forFeature([
      { name: BlogClass.name, schema: BlogSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsQueryRepository, BlogsService, PostsQueryRepository, PostsService, BlogsRepository],
})
export class AppModule {}
