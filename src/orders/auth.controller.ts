import { Controller, Post, Body, SetMetadata } from "@nestjs/common";
import { AuthService } from "./auth.service";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Post("refresh")
  refreshToken(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refreshToken(body.userId, body.refreshToken);
  }
}
