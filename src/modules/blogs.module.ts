// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { BlogClass, BlogSchema } from 'src/schema/blogs.schema';
// import { BlogsController } from 'src/api/blogs/blogs.controller';
// import { BlogsQueryRepository } from 'src/api/blogs/blogs.queryReposity';
// import { BlogsService } from 'src/api/blogs/blogs.service';
// import { PostsService } from 'src/api/posts/posts.service';
// import { BlogsRepository } from 'src/api/blogs/blogs.repository';
// import { PostsQueryRepository } from 'src/api/posts/postQuery.repository';
// import { PostClass, PostSchema } from 'src/schema/post.schema';
// import { LikeClass, LikeSchema } from 'src/schema/likes.schema';
// import { PostsRepository } from 'src/api/posts/posts.repository';
// import { likesRepository } from 'src/api/likes/likes.repository';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
// 		{ name: BlogClass.name, schema: BlogSchema },
// 		{name: PostClass.name, schema: PostSchema },
// 		{name: LikeClass.name, schema: LikeSchema },
// 	]),
//   ],
//   controllers: [BlogsController],
//   providers: [BlogsQueryRepository, BlogsService, PostsQueryRepository, PostsService, BlogsRepository, PostsRepository, likesRepository],
// })
// export class BlogsModule {}  
