'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from '@/stores/theme.store';

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();
  
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <ThemeInitializer>
          <div suppressHydrationWarning>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '8px',
                  padding: '12px 16px',
                },
              }}
            />
          </div>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeInitializer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
