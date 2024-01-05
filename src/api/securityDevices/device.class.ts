import { ObjectId } from "mongodb";

export class Devices {
	constructor(
	  public _id: ObjectId,
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

  