import { Locale } from '../enums/locale.enum';
import { UserRole } from '../enums/user-role.enum';

export class UserEntity {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  locale: Locale;
  timezone: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: Record<string, string>;
}
