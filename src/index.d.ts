import { UserClass } from './schema/user.schema';

declare global {
	namespace Express {
		export interface Request {
			user: UserClass | null
		}
	}
}