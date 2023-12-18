import { BlogsModel } from "src/db/db";

export class BlogsRepository {
	async deleteRepoBlogs() {
		const deletedAll = await BlogsModel.deleteMany({});
    return deletedAll.deletedCount === 1;
	}
}