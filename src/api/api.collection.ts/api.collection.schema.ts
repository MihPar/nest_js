import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { CollectionIP } from './api.collection.class'
import { DeviceView, Devices } from '../securityDevices/device.class'

export const CollectioInIPSchema = new mongoose.Schema<WithId<CollectionIP>>({
	IP: {type: String, require: true},
	URL: {type: String, require: true},
	date: {type: Date, require: true}
})

export const DeviceSchema = new mongoose.Schema<WithId<Devices>>({
	ip: {type: String, require: true},
    title: {type: String, require: true},
    deviceId: {type: String, require: true},
    userId: {type: String, require: true},
	lastActiveDate: {type: String, require: true}
})

export const DeviceViewSchema = new mongoose.Schema<WithId<DeviceView>>({
	ip: {type: String, require: true},
    title: {type: String, require: true},
    deviceId: {type: String, require: true},
	lastActiveDate: {type: String, require: true}
})