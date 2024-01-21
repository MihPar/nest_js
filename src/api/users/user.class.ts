import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength 	} from "class-validator";

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

const Trim = () => Transform(({value}: TransformFnParams) => {
	return value?.trim()
})

export class InputModelClassCreateBody {
	// @Length(3, 10)
	@IsString()
	@Trim()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(10)
	login: string

	// @Length(6, 20)
	@IsString()
	@Trim()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	@IsNotEmpty()
	password: string

	@IsEmail({}, {
		message: "incorrect email"
	})
	email: string
 }