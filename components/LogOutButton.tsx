'use client';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';

const LogOutButton = () => {
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <Button
      variant='default'
      className=''
      type='button'
      onClick={() => signOut(() => router.push('/'))}
    >
      Sign out
    </Button>
  );
};

export default LogOutButton;
