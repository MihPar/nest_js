import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const UserIdDecorator = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
	  const request = ctx.switchToHttp().getRequest();
	  return request.user?.id ?? null;
	},
  );