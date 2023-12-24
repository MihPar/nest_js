import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './blogs.module';
import { CommentModule } from './comments.module';
import { PostsModule } from './posts.module';
import { UsersModule } from './users.module';
import { LikesModule } from './likes.module';

@Module({
  imports: [
	ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL ==='true' ?  process.env.LOCAL_MONGO_URL! : process.env.MONGO_URL!),
	BlogsModule,
	CommentModule,
	PostsModule,
	UsersModule,
	LikesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}