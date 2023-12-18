import { WithId } from "mongodb";
import mongoose from "mongoose";
import { Devices } from "./device.class";

export const DeviceSchema = new mongoose.Schema<WithId<Devices>>({
	ip: {type: String, require: true},
    title: {type: String, require: true},
    deviceId: {type: String, require: true},
    userId: {type: String, require: true},
	lastActiveDate: {type: String, require: true}
})