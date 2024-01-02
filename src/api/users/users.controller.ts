import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { UsersQueryRepository } from './users.queryRepository';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(
	protected usersQueryRepository: UsersQueryRepository,
	protected usersService: UsersService
	) {}
  @Get()
  @HttpCode(200)
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
		query.sortBy = query.sortBy || 'createdAt'
		query.sortDirection = query.sortDirection || "desc"
		query.pageNumber = query.pageNumber || '1'
		query.pageSize = query.pageSize || '10'
		query.searchLoginTerm = query.searchLoginTerm || ''
		query.searchEmailTerm = query.searchEmailTerm || ''
		
    const users = await this.usersQueryRepository.getAllUsers(
		query.sortBy,
		query.sortDirection,
		query.pageNumber,
		query.pageSize,
		query.searchLoginTerm,
		query.searchEmailTerm
    );
	return users
  }

  @Post()
  async createUser(@Body() body: {login: string, password: string, email: string}) {
	const createUser = await this.usersService.createNewUser(body.login, body.password, body.email)
	return createUser
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUserById(@Param('id') userId: string) {
	const deleteUserById = await this.usersService.deleteUserById(userId)
	if (!deleteUserById) throw new NotFoundException("Blogs by id not found")
  }
}
