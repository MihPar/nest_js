import { ObjectId } from "mongodb";

export class CollectionIP {
	constructor(
	  public _id: ObjectId,
	  public URL: string,
	  public date: Date,
	  public IP?: string
	) {}
  }