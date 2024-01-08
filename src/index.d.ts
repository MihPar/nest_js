import { Users } from 'api/users/user.class';

declare global {
	namespace Express {
		export interface Request {
			user: Users | null
		}
	}
}