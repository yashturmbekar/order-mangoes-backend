import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "./customer.entity";

@Injectable()
export class AuthService {
  private users = [
    {
      id: "1",
      role: "admin",
      username: "admin@gmail.com",
      password: "$2b$10$81Hk2.t0VpOl87P.NyVFwOaJhJv9ueZGUBfO.plbIz0cmAt5cuNde", // bcrypt hash for 'admin@1312'
    },
  ];

  private refreshTokens: Map<string, string> = new Map(); // Store refresh tokens

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find((user) => user.username === username);

    if (user && (await bcrypt.compare(password, user.password))) {
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
    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

    this.refreshTokens.set(user.id, refreshToken); // Store refresh token

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async loginWithPhoneNumber(phoneNumber: string) {
    const customer = await this.customerRepository.findOne({
      where: { phone: phoneNumber },
    });
    if (customer) {
      const payload = { username: customer.name, sub: customer.id, role: "customer" };
      const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

      this.refreshTokens.set(customer.id, refreshToken); // Store refresh token

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }
  }

  async refreshToken(userId: string, token: string) {
    const storedToken = this.refreshTokens.get(userId);
    if (storedToken !== token) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const payload = { username: user.username, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: "15m" });

    return {
      access_token: newAccessToken,
    };
  }
}
