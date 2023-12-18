import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { UsersQueryRepository } from './users.queryRepository';
import { UserService } from './user.service';

@Controller()
export class UsersController {
  constructor(
	protected usersQueryRepository: UsersQueryRepository,
	protected userService: UserService
	) {}
  @Get()
  async getAllUsers(
    @Query()
    query: {
      sortBy: string;
      sortDirection: string;
      pageNumber: string;
      pageSize: string;
      searchLoginTerm: string;
      searchEmailTerm: string;
    },
  ) {
    const users = await this.usersQueryRepository.getAllUsers(
      query.sortBy = 'createAt',
      query.sortDirection = "desc",
	  query.pageNumber = '1',
      query.pageSize = '10',
      query.searchLoginTerm = '',
      query.searchEmailTerm = '',
    );
	return users
  }

  @Post()
  async createUser(@Body() login: string, password: string, email: string) {
	const createUser = await this.userService.createNewUser(login, password, email)
	return createUser
  }

  @Delete(':id')
  async deleteUserById(@Param('id') userId: string) {
	const deleteUserById = await this.userService.deleteUserById(userId)
  }
}
