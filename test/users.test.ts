// import { UsersService } from './../src/api/users/user.service';
// import { UsersQueryRepository } from './../src/api/users/users.queryRepository';
// import { EmailManager } from './../src/api/manager/email.manager';
// import { UsersRepository } from './../src/api/users/user.repository';
// import { EmailAdapter } from '../src/api/adapter/email.adapter';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose from 'mongoose';
// import { UserViewType } from '../src/api/users/user.type';
// import { ObjectId } from 'mongodb';
// import {v4 as uuidv4} from "uuid"
// import { add } from 'date-fns';


// jest.setTimeout(100000000)

// describe('integration test for usersService', async () => {
//   let mongoServer: MongoMemoryServer;

//   beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     const mongoUri = mongoServer.getUri();
//     await mongoose.connect(mongoUri);
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//   });

//   const usersRepository = new UsersRepository(userModel);
//   const emailAdapterMock: jest.Mocked<EmailAdapter> = {
//     sendEmail: jest.fn(),
//   };
//   const emailAdapter = new EmailAdapter()
//   const emailManager = new EmailManager(emailAdapter);
//   const usersQueryRepository = new UsersQueryRepository(userModel);
//   const usersService = new UsersService(
//     usersRepository,
//     emailManager,
//     emailAdapterMock,
//     usersQueryRepository,
//   );

//   describe('create users', () => {
//     it('this.emailAdapter.sendEmail should be called', async () => {
//       let email = '1234mpara7274@gmail.com';
//       let password = '123';
//       let login = 'Mickhail';
//       const result: UserViewType = await usersService.createNewUser(
//         login,
//         password,
//         email,
//       );

//       expect(emailAdapterMock.sendEmail).toBeCalled();
//     });
//   });

//   it('should currect created user', async () => {
//     let email = 'mpara7274@gmail.com';
//     let password = '123';
//     let login = 'Mickhail';
//     const result: UserViewType = await usersService.createNewUser(
//       login,
//       password,
//       email,
//     );

//     expect(result.accountData.userName).toBe(login);
//     expect(result.accountData.email).toBe(email);
//     expect(result.emailConfirmation.isConfirmed).toBe(false);
//   });

//   describe("confirmEmail", () => {

// 	it("should return false for expired confirmation code", async () => {
// 		await userModel.insertMany([{
// 			_id: new ObjectId(),
// 			accountData: {
// 			  userName: "",
// 			  email: "mpara7274@gmail.com",
// 			  passwordHash: "",
// 			  createdAt: new Date().toISOString(),
// 			},
// 			emailConfirmation: {
// 			  confirmationCode: uuidv4(),
// 			  expirationDate: add(new Date(), {
// 				hours: 1,
// 				minutes: 10,
// 			  }),
// 			  isConfirmed: false,
// 			},
// 			getViewUser(): UserViewType {
// 			  return {
// 				id: this._id.toString(),
// 				login: this.accountData.userName,
// 				email: this.accountData.email,
// 				createdAt: this.accountData.createdAt,
// 			  };
// 			},
// 		}]);
// 		let email = 'mpara7274@gmail.com';
// 		let password = '123';
// 		let login = 'Mickhail';
// 		const result: UserViewType = await authService.confirmation(
// 		  login,
// 		  password,
// 		  email,
// 		);
	
// 		expect(result).toBeFalsy();
// 	})
//   })
// });