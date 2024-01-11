import { IsEmail, IsNotEmpty, Length 	} from "class-validator";

// export class DbId {
// 	_id: ObjectId
// 	constructor() {
// 		this._id = new mongoose.Types.ObjectId()
// 	}
// }

// export class Users extends DbId {
// 	constructor(
// 	  public accountData: AccountDataType,
// 	  public emailConfirmation: EmailConfirmationType
// 	) {
// 	  super();
// 	}
// 	getViewUser(): UserViewType {
// 	  return {
// 		id: this._id.toString(),
// 		login: this.accountData.userName,
// 		email: this.accountData.email,
// 		createdAt: this.accountData.createdAt,
// 	  };
// 	}
// }

export class InputModelClassCreateBody {
	@Length(3, 10)
	login: string
	@Length(6, 20)
	@IsNotEmpty()
	password: string
	@IsEmail({}, {
		message: "incorrect email"
	})
	email: string
 }