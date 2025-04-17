import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      throw new UnauthorizedException("Authorization header is missing");
    }

    const token = authHeader.split(" ")[1];
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;

      if (roles && !roles.includes(payload.role)) {
        throw new UnauthorizedException(
          "You do not have permission to access this resource"
        );
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
