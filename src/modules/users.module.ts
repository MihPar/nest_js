import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserClass, UserSchema } from 'src/schema/user.schema';
import { UsersController } from 'src/api/users/users.controller';
import { UsersQueryRepository } from 'src/api/users/users.queryRepository';
import { UserService } from 'src/api/users/user.service';
import { UsersRepository } from 'src/api/users/user.repository';
import { EmailManager } from 'src/api/manager/email.manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserClass.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersQueryRepository, UserService, UsersRepository, EmailManager],
})
export class UsersModule {}
