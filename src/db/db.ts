import mongoose from "mongoose";
import { CommentsDB } from "src/comment/comment.class";
import { CommentSchema } from "src/comment/comment.schema";
import { Like } from "src/likes/likes.class";
import { LikesInfoSchema } from "src/likes/likes.schema";
import { PostSchema } from "src/posts/post.schema";
import { PostsDB } from "src/posts/posts.class";
import { Devices } from "src/securityDevices/device.class";
import { DeviceSchema } from "src/securityDevices/device.schema";
import { Users } from "src/users/user.class";
import { DBUserSchema } from "src/users/user.schema";

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