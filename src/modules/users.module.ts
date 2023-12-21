import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserClass, UserSchema } from 'src/schema/user.schema';
import { UsersController } from 'src/api/users/users.controller';
import { UsersQueryRepository } from 'src/api/users/users.queryRepository';
import { UserService } from 'src/api/users/user.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGOOSE_DB_NAME,
      // loggerLevel: 'debug'
    }),
    MongooseModule.forFeature([{ name: UserClass.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersQueryRepository, UserService],
})
export class AppModule {}
