import { RouterProvider } from 'react-router';
import { router } from './router';
import { QueryProvider } from './providers/QueryProvider';
import { I18nProvider } from './providers/I18nProvider';
import { AuthProvider } from './providers/AuthProvider';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <I18nProvider>
      <QueryProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0d1526',
                border: '1px solid rgba(56,189,248,0.15)',
                color: '#e2e8f0',
              },
            }}
          />
        </AuthProvider>
      </QueryProvider>
    </I18nProvider>
  );
}
