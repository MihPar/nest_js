// import { WithId } from "mongodb";
// import mongoose from "mongoose";
// import { Devices } from "./device.class";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// export const DeviceSchema = new mongoose.Schema<WithId<Devices>>({
// 	ip: {type: String, require: true},
//  title: {type: String, require: true},
//  deviceId: {type: String, require: true},
//  userId: {type: String, require: true},
// 	lastActiveDate: {type: String, require: true}
// })

export type DeviceDocument = HydratedDocument<DeviceClass>

@Schema()
export class DeviceClass {
	@Prop({
		required: true
	})
	ip: string

	@Prop({
		required: true
	})
	title: string

	@Prop({
		required: true
	})
	deviceId: string

	@Prop({
		required: true
	})
	userId: string

	@Prop({
		required: true
	})
	lastActiveDate: string
}

export const DeviceSchema = SchemaFactory.createForClass(DeviceClass);