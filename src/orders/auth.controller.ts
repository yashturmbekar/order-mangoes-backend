import {
  Controller,
  Post,
  Body,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CustomerService } from "./customer.service";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService
  ) {}

  @Post("login")
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Post("refresh")
  refreshToken(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshToken(body.userId, body.refreshToken);
  }

  @Post("verify-otp")
  async verifyOtp(@Body() body: { phone: string; otp: string }) {
    const isValid = await this.customerService.verifyOtp(body.phone, body.otp);
    if (!isValid) {
      throw new UnauthorizedException("Invalid or expired OTP");
    }
    return { message: "OTP verified successfully" };
  }

  @Post("generate-otp")
  async generateOtp(@Body() body: { phone: string }) {
    const result = await this.customerService.generateOtp(body.phone);
    if (typeof result === "object" && result.message) {
      return result; // Return only the message if no customer is found
    }
    return { message: "OTP generated successfully" }; // Return success message otherwise
  }
}
