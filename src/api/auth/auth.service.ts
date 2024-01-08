// import { JwtService } from "@nestjs/jwt";
// import { UsersService } from "../users/user.service";

// export class AuthService {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly jwtService: JwtService,
//   ) {}
//   async validateUser(username: string, pass: string): Promise<any> {
//     const user = await this.usersService.findOne(username);
//     if (user && user.password === pass) {
//       const { passwod, ...result } = user;
//       return result;
//     }
//     return null;
//   }
//   async login(user: any) {
//     const payload = { username: user.username, sub: user.userld };
//     return { access_token: this.jwtService.sign(payload) };
//   }
// }