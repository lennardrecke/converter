import React from 'react';
import type { Metadata } from 'next';
import Hello from '@/components/Hello';
import LogOutButton from '@/components/LogOutButton';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Access real-time data, track key performance indicators, and manage your projects efficiently on our interactive Dashboard.',
};

const Dashboard = () => {
  return (
    <div className='[&_p]:my-6'>
      <LogOutButton />
      <Hello />
    </div>
  );
};

export default Dashboard;
