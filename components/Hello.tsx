import { currentUser } from '@clerk/nextjs';
import React from 'react';

const Hello = async () => {
  const user = await currentUser();

  return (
    <div className=''>
      <p className=''>👋 Hello, {user?.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
};

export default Hello;
