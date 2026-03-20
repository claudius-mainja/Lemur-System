import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'LemurSystem - All-in-One ERP for Small Business',
  description: 'Streamline your business with integrated HR, Payroll, Finance, and Supply Chain management. Free trial.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LemurSystem',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body suppressHydrationWarning className={`${montserrat.variable} font-sans antialiased bg-dark-bg text-dark-text`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
