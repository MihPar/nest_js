import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type DeviceDocument = HydratedDocument<DeviceClass>;

@Schema({ versionKey: false })
export class DeviceClass {
		_id: mongoose.Types.ObjectId;
	@Prop({required: true})
		ip: string;
	@Prop({required: true})
    	title: string;
	@Prop({required: true})
    	deviceId: string;
	@Prop({required: true})
    	userId: string;
	@Prop({requred: true})
		lastActiveDate: string;
}

export const DeviceSchema = SchemaFactory.createForClass(DeviceClass);
