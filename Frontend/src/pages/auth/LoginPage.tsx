import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/features/auth/store';
import { ROUTES } from '@/shared/constants/routes';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoginError('');
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch {
      setLoginError(t('auth.loginError'));
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #080c14 0%, #0a1628 40%, #0d1f3c 70%, #071525 100%)',
          }}
        />
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(56,189,248,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(6,182,212,0.08) 0%, transparent 40%)',
          }}
        />
        {/* Grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 border border-primary/25">
              <span className="text-sm font-bold text-primary font-mono">ML</span>
            </div>
            <span className="font-semibold text-foreground">{t('common.appName')}</span>
          </div>
          <div>
            <blockquote className="text-2xl font-light text-foreground/80 leading-relaxed mb-4">
              "Cuộc đời không phải là thứ xảy ra với bạn.<br />
              Đó là thứ bạn tạo ra."
            </blockquote>
            <p className="text-sm text-muted-foreground">— Hệ thống nhật ký cá nhân</p>
          </div>
          <div className="flex gap-4">
            {['Finance', 'Journal', 'Goals', 'Learning'].map((tag) => (
              <span key={tag} className="text-xs font-mono text-primary/60 border border-primary/15 rounded px-2 py-1">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mx-auto lg:mx-0">
              <Lock size={22} className="text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">{t('auth.welcomeBack')}</h1>
            <p className="text-sm text-muted-foreground">{t('auth.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                label={t('auth.email')}
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Mail size={14} className="absolute right-3 top-[34px] text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative">
              <Input
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="rememberMe" {...register('rememberMe')} className="size-3.5 rounded accent-primary" />
              <label htmlFor="rememberMe" className="text-xs text-muted-foreground">{t('auth.rememberMe')}</label>
            </div>

            {loginError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {loginError}
              </div>
            )}

            <Button type="submit" fullWidth loading={isSubmitting} size="lg" className="mt-2">
              {t('auth.loginButton')}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            MyLife OS — Personal Life Management
          </p>
        </div>
      </div>
    </div>
  );
}
