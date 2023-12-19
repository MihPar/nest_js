import { Injectable } from "@nestjs/common";
import { IPCollectionModel } from "src/db/db";

@Injectable()
export class IPCollectionRepositories {
	async deleteAllDevices() {
		const deletedAll = await IPCollectionModel.deleteMany({})
		return deletedAll.acknowledged;
	}
}