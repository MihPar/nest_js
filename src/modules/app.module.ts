
import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './blogs.module';
import { CommentModule } from './comments.module';
import { LikesModule } from './likes.module';
import { PostsModule } from './posts.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
	ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
	BlogsModule,
	CommentModule,
	LikesModule,
	PostsModule,
	UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
