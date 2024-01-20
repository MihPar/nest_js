import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserClass } from '../../schema/user.schema';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const UserIdDecorator = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
	  const request = ctx.switchToHttp().getRequest();
	  return (request.user as UserClass)?._id ?? null;
	},
  );