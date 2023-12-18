import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { LikesModel } from "src/db/db";

@Injectable()
export class likesRepositories {
	async findLikePostByUser(postId: string, userId: ObjectId) {
		return LikesModel.findOne({userId, postId: postId}, {__v: 0}).lean()
	}

	async saveLikeForPost(postId: string, userId: ObjectId, likeStatus: string, userLogin: string) {
		const saveResult = await LikesModel.create({postId, userId, myStatus: likeStatus, login: userLogin, addedAt: new Date().toISOString()})
		return saveResult.id
	}

	async updateLikeStatusForPost(postId: string, userId: ObjectId, likeStatus: string) {
		const saveResult = await LikesModel.updateOne({postId, userId}, {myStatus: likeStatus})
		return saveResult
	}
}