import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../infrastructure/schemas/user.schema';
import { UserRole } from '../domain/enums/user-role.enum';
import { Locale } from '../domain/enums/locale.enum';
import { UpdateProfileDto } from '../presentation/dto/update-profile.dto';
import { UserResponseDto } from '../presentation/dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async requireById(id: string): Promise<UserDocument> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' });
    return user;
  }

  async createOwnerIfMissing(email: string, password: string): Promise<UserResponseDto> {
    const existing = await this.findByEmail(email);
    if (existing) return this.toResponse(existing);
    const passwordHash = await bcrypt.hash(password, 12);
    const created = await this.userModel.create({
      email: email.toLowerCase(),
      passwordHash,
      displayName: 'Mạnh',
      role: UserRole.OWNER,
      locale: Locale.VI,
      timezone: 'Asia/Ho_Chi_Minh',
      bio: 'Software Engineer Fullstack, UIT student, creator of MyLife OS.',
    });
    return this.toResponse(created);
  }

  async updateRefreshTokenHash(userId: string, refreshTokenHash?: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash }).exec();
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserResponseDto> {
    const user = await this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
    if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' });
    return this.toResponse(user);
  }

  async getBiography(userId: string) {
    const user = await this.requireById(userId);
    return { content: user.bio ?? '' };
  }

  async updateBiography(userId: string, content: string) {
    const user = await this.userModel.findByIdAndUpdate(userId, { bio: content }, { new: true }).exec();
    if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' });
    return { content: user.bio ?? '' };
  }

  async ensureEmailAvailable(email: string) {
    const exists = await this.findByEmail(email);
    if (exists) throw new ConflictException({ code: 'EMAIL_EXISTS', message: 'Email already exists' });
  }

  toResponse(user: UserDocument): UserResponseDto {
    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      locale: user.locale,
      timezone: user.timezone,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      socialLinks: user.socialLinks,
    };
  }
}
