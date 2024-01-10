import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';

export type IPCollectionDocument = HydratedDocument<IPCollectionClass>;
@Schema({ versionKey: false })
export class IPCollectionClass {
		_id?: mongoose.Types.ObjectId;
	@Prop({required: true})
		IP: string;
	@Prop({required: true})
		URL: string;
	@Prop({required: true})
		date: Date;
}

export const IPCollectionSchema = SchemaFactory.createForClass(IPCollectionClass);