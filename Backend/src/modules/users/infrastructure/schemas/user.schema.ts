import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Locale } from '../../domain/enums/locale.enum';
import { UserRole } from '../../domain/enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ enum: UserRole, default: UserRole.VIEWER, index: true })
  role: UserRole;

  @Prop({ enum: Locale, default: Locale.VI })
  locale: Locale;

  @Prop({ default: 'Asia/Ho_Chi_Minh' })
  timezone: string;

  @Prop()
  bio?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ type: Object })
  socialLinks?: Record<string, string>;

  @Prop()
  refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
