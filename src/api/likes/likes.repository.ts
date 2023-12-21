import { LikesModel } from 'src/db/db';
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { LikeClass, LikeDocument } from 'src/schema/likes.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class likesRepository {
	constructor(@InjectModel(LikeClass.name) private likeModel: LikeDocument) {}

	async findLikePostByUser(postId: string, userId: ObjectId) {
		const result = new this.likeModel({userId, postId: postId}, {__v: 0})
		return result.find()
	}

	async saveLikeForPost(postId: string, userId: ObjectId, likeStatus: string, userLogin: string) {
		const saveResult = await LikesModel.create({postId, userId, myStatus: likeStatus, login: userLogin, addedAt: new Date().toISOString()})
		return saveResult.id
	}

	async updateLikeStatusForPost(postId: string, userId: ObjectId, likeStatus: string) {
		const saveResult = await LikesModel.updateOne({postId, userId}, {myStatus: likeStatus})
		return saveResult
	}

	async findLikeCommentByUser(commentId: string, userId: ObjectId) {
		return LikesModel.findOne({userId,  commentId}, {__v: 0}).lean()
	}

	async saveLikeForComment(commentId: string, userId: ObjectId, likeStatus: string) {
		const saveResult = await LikesModel.create({commentId: commentId, userId: userId, myStatus: likeStatus, postId: null})
		const usesrComment = await LikesModel.findOne({userId: userId, commentId: commentId}, {__v: 0}).lean()
	}

	async updateLikeStatusForComment(commentId: string, userId: ObjectId, likeStatus: string){
		const saveResult = await LikesModel.updateOne({commentId: commentId, userId: userId}, {myStatus: likeStatus})
		return saveResult
	}
}