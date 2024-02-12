import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { GrMenu } from 'react-icons/gr';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from './ui/sheet';
import { UserButton, currentUser } from '@clerk/nextjs';

export default async function Navbar() {
  const user = await currentUser();

  return (
    <nav className='fixed z-50 flex h-24 w-full items-center justify-between bg-white bg-opacity-30 px-4 py-10 backdrop-blur-md md:px-8 lg:px-12 xl:px-16 2xl:px-24'>
      <Link href='/dashboard'>
        <div className='flex cursor-pointer items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Conversio
        </div>
      </Link>
      <div className='mx-auto hidden gap-1 md:flex md:gap-2 lg:gap-4'>
        <Button variant='ghost' className='text-md font-semibold'>
          <Link href='/dashboard'>Home</Link>
        </Button>
        <Link href='/about'>
          <Button variant='ghost' className='text-md font-semibold'>
            About
          </Button>
        </Link>
        <Link href='/privacy-policy'>
          <Button variant='ghost' className='text-md font-semibold'>
            Privacy Policy
          </Button>
        </Link>
      </div>
      <Sheet>
        <SheetTrigger className='block p-3 md:hidden'>
          <span className='text-2xl'>
            <GrMenu />
          </span>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetDescription>
              <div className='w-full space-y-3'>
                <Button variant='ghost' className='text-md font-semibold'>
                  <Link href='/'>Home</Link>
                </Button>
                <Link href='/about'>
                  <Button variant='ghost' className='text-md font-semibold'>
                    About
                  </Button>
                </Link>
                <Link href='/privacy-policy'>
                  <Button variant='ghost' className='text-md font-semibold'>
                    Privacy Policy
                  </Button>
                </Link>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      {user && <UserButton afterSignOutUrl='/' />}
    </nav>
  );
}
