import { Injectable } from "@nestjs/common";
import { LikeClass, LikeDocument } from '../../schema/likes.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { ObjectId } from "mongodb";

@Injectable()
export class LikesRepository {
	constructor(@InjectModel(LikeClass.name) private likeModel: Model<LikeDocument>) {}

	async deleteLikes() {
		const deleteAllLikes = await this.likeModel.deleteMany({});
    	return deleteAllLikes.deletedCount === 1;
	}

	// async findLikePostByUser(postId: string, userId: ObjectId) {
	// 	const result = new this.likeModel({userId, postId: postId}, {__v: 0})
	// 	return result.find()
	// }

	// async saveLikeForPost(postId: string, userId: ObjectId, likeStatus: string, userLogin: string) {
	// 	const saveResult = await LikesModel.create({postId, userId, myStatus: likeStatus, login: userLogin, addedAt: new Date().toISOString()})
	// 	return saveResult.id
	// }

	// async updateLikeStatusForPost(postId: string, userId: ObjectId, likeStatus: string) {
	// 	const saveResult = await LikesModel.updateOne({postId, userId}, {myStatus: likeStatus})
	// 	return saveResult
	// }

	async findLikeCommentByUser(commentId: string, userId: ObjectId) {
		return this.likeModel.findOne({userId,  commentId}).lean() //
	}

	async saveLikeForComment(commentId: string, userId: ObjectId, likeStatus: string) {
		const saveResult = await this.likeModel.create({commentId: commentId, userId: userId, myStatus: likeStatus, postId: null})
		const usesrComment = await this.likeModel.findOne({userId: userId, commentId: commentId}).lean() //
		
	}

	async updateLikeStatusForComment(commentId: string, userId: ObjectId, likeStatus: string){
		const saveResult = await this.likeModel.updateOne({commentId: commentId, userId: userId}, {myStatus: likeStatus})
		return saveResult
	}
}