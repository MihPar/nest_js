import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { likesRepository } from 'src/api/likes/likes.repository';
import { LikeClass, LikeSchema } from 'src/schema/likes.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGOOSE_DB_NAME,
      // loggerLevel: 'debug'
    }),
    MongooseModule.forFeature([{ name: LikeClass.name, schema: LikeSchema }]),
  ],
  controllers: [],
  providers: [likesRepository],
})
export class AppModule {}
