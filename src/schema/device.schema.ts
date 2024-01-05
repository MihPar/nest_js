import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type DeviceDocument = HydratedDocument<DeviceClass>;

@Schema({ _id: false, versionKey: false })
export class DeviceClass {
	_id: Types.ObjectId
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
