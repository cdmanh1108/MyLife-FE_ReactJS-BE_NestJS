import i18n from '@/shared/i18n';

export function getErrorMessage(error: any, defaultMessage?: string): string {
  const fallback = defaultMessage || i18n.t('common.errorTryAgain');
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (typeof error.message === 'string') return error.message;
  
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data;
    if (data.error && typeof data.error === 'object' && typeof data.error.message === 'string') {
      return data.error.message;
    }
    if (typeof data.message === 'string') {
      return data.message;
    }
  }

  if (error.error && typeof error.error === 'object' && typeof error.error.message === 'string') {
    return error.error.message;
  }

  return fallback;
}
