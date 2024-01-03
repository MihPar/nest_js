import { InputModelClassCreateBody } from "api/users/user.class"
import { validateOrReject } from "class-validator"

const validateOrRejectModel = async (model: any, ctor: {new(): any}) => {
	if(model instanceof ctor === false) {
		throw new Error("incorrect input data")
	}
	try {
		await validateOrReject(model)
	} catch(error) {
		throw new Error(error)
	}
}