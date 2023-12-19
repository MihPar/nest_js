import { Injectable } from "@nestjs/common";
import { IPCollectionRepositories } from "./api.collectionRepository";

@Injectable()
export class IPCollectionService {
	constructor(
		protected IPCollectionRepositories: IPCollectionRepositories
	) {}
	async deleteAllCollection() {
		return await this.IPCollectionRepositories.deleteAllDevices()
	}
}