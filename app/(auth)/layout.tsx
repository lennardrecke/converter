import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Converter',
  description: 'Convert your files to any format',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let dashboardUrl = '/dashboard';

  return (
    <ClerkProvider
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={dashboardUrl}
      afterSignUpUrl={dashboardUrl}
    >
      <html lang='en'>
        <body className={inter.className}>
          <Navbar />
          <Toaster />
          <div className='container min-h-screen max-w-4xl pt-32 lg:max-w-6xl lg:pt-36 2xl:max-w-7xl 2xl:pt-44'>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
