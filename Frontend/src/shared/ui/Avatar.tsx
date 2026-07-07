import { cn } from '@/shared/lib/cn';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'size-7 text-xs', md: 'size-9 text-sm', lg: 'size-12 text-base' };

function initials(name?: string) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  return (
    <div className={cn('rounded-full flex items-center justify-center font-medium flex-shrink-0 overflow-hidden', sizes[size], !src && 'bg-primary/15 text-primary border border-primary/20', className)}>
      {src ? <img src={src} alt={name} className="size-full object-cover" /> : initials(name)}
    </div>
  );
}
