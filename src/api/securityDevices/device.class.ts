import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export class Devices {
	constructor(
	  public _id = new mongoose.Types.ObjectId(),
	//   public _id: ObjectId,
	  public ip: string,
	  public title: string,
	  public deviceId: string,
	  public userId: string,
	  public lastActiveDate: string
	) {}
  }

  export class DeviceView {
	constructor(
	  public ip: string,
	  public title: string,
	  public deviceId: string,
	  public lastActiveDate: string
	) {}
  }

  