import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const { userId } = auth();

  if (userId) {
    //TODO: Change to desired path
    redirect('/dashboard');
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      {children}
    </div>
  );
}
