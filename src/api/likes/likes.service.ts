import { Injectable } from "@nestjs/common";
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
	constructor(
		protected likesRepository: LikesRepository
	) {}
}