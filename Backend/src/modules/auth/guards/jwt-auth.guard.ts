import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';
import { UsersService } from '../../users/application/users.service';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { JwtPayload } from '../application/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException({ code: 'MISSING_TOKEN', message: 'Missing bearer token' });

    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET') ?? this.config.get<string>('jwt.accessSecret'),
      });
      const user = await this.usersService.requireById(payload.sub);
      request.user = { id: user._id.toString(), email: user.email, role: user.role };
      return true;
    } catch {
      throw new UnauthorizedException({ code: 'INVALID_ACCESS_TOKEN', message: 'Invalid or expired access token' });
    }
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
