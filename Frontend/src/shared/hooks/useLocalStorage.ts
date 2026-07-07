import { useState } from 'react';
import { storage } from '@/shared/lib/storage';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => storage.get<T>(key) ?? defaultValue);
  const set = (v: T) => {
    storage.set(key, v);
    setValue(v);
  };
  return [value, set] as const;
}
