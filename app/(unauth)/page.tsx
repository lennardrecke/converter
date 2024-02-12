import Dropzone from '@/components/Dropzone';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='space-y-16 pb-8'>
      <div className="">
      <h1 className='text-center text-3xl font-medium md:text-5xl'>
        Convert your files to any format
      </h1>
      </div>
      <Dropzone />
    </div>
  );
}
