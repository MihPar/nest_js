import mongoose from "mongoose";
import { CollectionIP } from "src/api/api.collection.ts/api.collection.class";
import { CollectioInIPSchema } from "src/api/api.collection.ts/api.collection.schema";
import { BlogsDB } from "src/api/blogs/blogs.class";
import { BlogsSchema } from "src/api/blogs/blogs.schema";
import { CommentsDB } from "src/api/comment/comment.class";
import { CommentSchema } from "src/api/comment/comment.schema";
import { Like } from "src/api/likes/likes.class";
import { LikesInfoSchema } from "src/api/likes/likes.schema";
import { PostSchema } from "src/api/posts/post.schema";
import { PostsDB } from "src/api/posts/posts.class";
import { Devices } from "src/api/securityDevices/device.class";
import { DeviceSchema } from "src/api/securityDevices/device.schema";
import { Users } from "src/api/users/user.class";
import { DBUserSchema } from "src/api/users/user.schema";

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = process.env.MONGOOSE_DB_NAME || 'mongoose-example'

export async function runDb() {
	try {
		await mongoose.connect(mongoURI)
		console.log('Connect successfully to mongo server')
	} catch(e) {
		console.log('Cann`t to connect to db:', e)
		await mongoose.disconnect()
	}
}

export const stopDb = async () => {
	await mongoose.connection.close()
}

export const UsersModel = mongoose.model<Users>('user', DBUserSchema)
export const DevicesModel = mongoose.model<Devices>('device', DeviceSchema)
export const PostsModel = mongoose.model<PostsDB>('posts', PostSchema)
export const LikesModel = mongoose.model<Like>('like-dislike', LikesInfoSchema)
export const CommentsModel = mongoose.model<CommentsDB>('comment', CommentSchema)
export const BlogsModel = mongoose.model<BlogsDB>('blogs', BlogsSchema)
export const IPCollectionModel = mongoose.model<CollectionIP>('IP', CollectioInIPSchema)