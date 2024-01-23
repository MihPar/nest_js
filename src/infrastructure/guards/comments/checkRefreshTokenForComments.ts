import {CanActivate, createParamDecorator, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import jwt from 'jsonwebtoken'
import { UsersRepository } from "../../../api/users/user.repository";



@Injectable()
export class  authMiddleware implements CanActivate {
  constructor(
	protected usersRepository: UsersRepository
	) {
  }

  async  canActivate(
        context: ExecutionContext,
    ): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            throw new UnauthorizedException()
        }

        const token = request.headers.authorization.split(' ')[1];
		let result: any
		try {
            result = jwt.verify(token,'123' )
        } catch (error) {
            result = null
        }
        if (result) {
            const user = await this.usersRepository.findUserById(result.userId.toString()).then(user => {
                request.user =  user ? user : null;
            })
            return true
        }
         else  throw new UnauthorizedException()
    }
}
