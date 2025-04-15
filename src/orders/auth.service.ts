import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private users = [
    {
      id: 1,
      username: "admin",
      password: "$2b$10$wrzRTxDwW6ij4h/S1UwtUOQ/AzCqUTqZWk58jeH/0uhhDjN/1YkxK", // bcrypt hash for 'admin123'
    },
  ];

  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find((user) => user.username === username);

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("password");
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
