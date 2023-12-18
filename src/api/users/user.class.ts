import { ObjectId } from "mongodb";
import { AccountDataType, EmailConfirmationType, UserViewType } from "./user.type";

export class DbId {
	_id: ObjectId
	constructor() {
		this._id = new ObjectId()
	}
}


export class Users extends DbId {
	constructor(
	  public accountData: AccountDataType,
	  public emailConfirmation: EmailConfirmationType
	) {
	  super();
	}
	getViewUser(): UserViewType {
	  return {
		id: this._id.toString(),
		login: this.accountData.userName,
		email: this.accountData.email,
		createdAt: this.accountData.createdAt,
	  };
	}
}