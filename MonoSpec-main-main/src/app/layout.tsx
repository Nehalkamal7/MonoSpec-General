import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MonoSpec — Precision in Every Spec.',
  description: 'Enterprise architecture specification and design system workspace for Awamer Alshabaka and Creative System.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('monospec-theme') || 'dark';
                  var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }

                  var locale = 'ar';
                  var storeStr = localStorage.getItem('monospec-storage');
                  if (storeStr) {
                    var parsed = JSON.parse(storeStr);
                    if (parsed && parsed.state && parsed.state.locale) {
                      locale = parsed.state.locale;
                    }
                  }
                  document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
                  document.documentElement.setAttribute('lang', locale);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full w-full bg-[var(--bg-canvas)] text-[var(--text-primary)]" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
