import Dropzone from '@/components/Dropzone';
import '@/app/globals.css';
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
  const user = await currentUser();

  return (
    <div className='space-y-16 pb-8'>
      <div className='space-y-8'>
        {user && (
          <h1 className='text-center text-2xl font-medium text-gray-400 md:text-4xl'>
            👋 Hello,{' '}
            <span className='inline-block bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text font-semibold text-transparent'>
              {user?.firstName}
            </span>
            !
          </h1>
        )}
        <h1 className='text-center text-3xl font-medium md:text-5xl'>
          Convert your files to any format
        </h1>
      </div>
      <Dropzone />
    </div>
  );
}
