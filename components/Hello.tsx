'use client';

import { currentUser } from '@clerk/nextjs';
import React from 'react';

export default async function Hello() {
  const user = await currentUser();
  const [loggedIn, setLoggedIn] = React.useState(false);

  if (user) {
    setLoggedIn(true);
  }

  return (
    <>
      {loggedIn && (
        <div className=''>
          <p className=''>👋 Hello, {user?.emailAddresses[0]?.emailAddress}</p>
        </div>
      )}
    </>
  );
}
