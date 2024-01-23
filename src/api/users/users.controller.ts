import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Query, UseFilters, UseGuards } from '@nestjs/common';
import { UsersQueryRepository } from './users.queryRepository';
import { UsersService } from './user.service';
import { InputModelClassCreateBody } from './user.class';
import { AuthBasic } from '../../infrastructure/guards/auth/basic.auth';
import { HttpExceptionFilter } from '../../exceptionFilters.ts/exceptionFilter';
import { CreateNewUserCommand } from './use-case/createNewUser-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserByIdCommnad } from './use-case/deleteUserById-use-case';

// @UseGuards(AuthGuard)
@UseGuards(AuthBasic)
@Controller('users')
export class UsersController {
  constructor(
	protected usersQueryRepository: UsersQueryRepository,
	protected usersService: UsersService,
	protected commandBus: CommandBus
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

  @HttpCode(201)
  @Post()
  @UseFilters(new HttpExceptionFilter())
  async createUser(@Body() body: InputModelClassCreateBody) {
	const command = new CreateNewUserCommand(body)
	const createUser = await this.commandBus.execute(command)
	return createUser
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUserById(@Param('id') id: string) {
	const command = new DeleteUserByIdCommnad(id)
	const deleteUserById = await this.commandBus.execute(command)
	if (!deleteUserById) throw new NotFoundException("Blogs by id not found 404")
  }
}
