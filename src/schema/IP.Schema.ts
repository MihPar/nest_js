import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from 'mongoose';

export type IPCollectionDocument = HydratedDocument<IPCollectionClass>;
@Schema({ _id: false, versionKey: false })
export class IPCollectionClass {
		_id: Types.ObjectId
	@Prop({required: true})
		IP: string;
	@Prop({required: true})
		URL: string;
	@Prop({required: true})
		date: Date;
}

export const IPCollectionSchema = SchemaFactory.createForClass(IPCollectionClass);