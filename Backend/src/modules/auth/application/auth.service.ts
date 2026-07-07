import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../../users/application/users.service';
import { UserDocument } from '../../users/infrastructure/schemas/user.schema';
import { AuthResponseDto, TokenPairDto } from '../presentation/dto/auth-response.dto';

export type JwtPayload = { sub: string; email: string; role: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
    const tokens = await this.issueTokens(user);
    return { ...tokens, user: this.usersService.toResponse(user) };
  }

  async refresh(refreshToken: string): Promise<TokenPairDto> {
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET') ?? this.config.get<string>('jwt.refreshSecret'),
      });
      const user = await this.usersService.requireById(payload.sub);
      if (!user.refreshTokenHash)
        throw new UnauthorizedException({ code: 'REFRESH_TOKEN_REVOKED', message: 'Refresh token revoked' });
      const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!matches)
        throw new UnauthorizedException({ code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token' });
      return this.issueTokens(user);
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException({ code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token' });
    }
  }

  async logout(userId: string): Promise<{ loggedOut: boolean }> {
    await this.usersService.updateRefreshTokenHash(userId, undefined);
    return { loggedOut: true };
  }

  async issueTokens(user: UserDocument): Promise<TokenPairDto> {
    const payload: JwtPayload = { sub: user._id.toString(), email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET') ?? this.config.get<string>('jwt.accessSecret'),
      expiresIn: (this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ??
        this.config.get<string>('jwt.accessExpiresIn') ??
        '15m') as any,
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET') ?? this.config.get<string>('jwt.refreshSecret'),
      expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ??
        this.config.get<string>('jwt.refreshExpiresIn') ??
        '30d') as any,
    });
    await this.usersService.updateRefreshTokenHash(user._id.toString(), await bcrypt.hash(refreshToken, 12));
    return { accessToken, refreshToken };
  }
}
