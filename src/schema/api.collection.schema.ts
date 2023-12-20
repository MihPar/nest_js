// import mongoose from 'mongoose'
// import { WithId } from 'mongodb'
// import { CollectionIP } from './api.collection.class'

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// export const CollectioInIPSchema = new mongoose.Schema<WithId<CollectionIP>>({
// 	IP: {type: String, require: true},
// 	URL: {type: String, require: true},
// 	date: {type: Date, require: true}
// })

export type IPCollectionDocument = HydratedDocument<IPCollectionClass>

@Schema()
export class IPCollectionClass {
	@Prop({
		required: true
	})
	IP: string

	@Prop({
		required: true
	})
	URL: string

	@Prop({
		required: true
	})
	date: Date
}

export const IPCollectionSchema = SchemaFactory.createForClass(IPCollectionClass)