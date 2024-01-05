import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersService } from '../users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		protected userService: UsersService
	) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
	console.log(request.headers.authorization)
	console.log(this.userService)
	// throw new UnauthorizedException()
    return true
  }
}