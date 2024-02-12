import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
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
      {children}
    </ClerkProvider>
  );
}
