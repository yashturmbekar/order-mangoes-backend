import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  private users = [
    {
      id: 1,
      username: "admin@gmail.com",
      password: "$2b$10$81Hk2.t0VpOl87P.NyVFwOaJhJv9ueZGUBfO.plbIz0cmAt5cuNde", // bcrypt hash for 'admin@1312'
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
