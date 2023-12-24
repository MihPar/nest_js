import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IPCollectionClass, IPCollectionDocument } from "src/schema/api.collection.schema";

@Injectable()
export class IPCollectionRepositories {
	constructor(
		@InjectModel(IPCollectionClass.name) private ipCollectionModel: Model<IPCollectionDocument>
	) {}
	async deleteAllDevices() {
		const deletedAll = this.ipCollectionModel.deleteMany({})
		// return deletedAll.acknowledged;
		return deletedAll.deleteMany()
	}
}