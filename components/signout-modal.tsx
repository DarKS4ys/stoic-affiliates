import { SignOutButton } from '@clerk/nextjs';
import React from 'react';
import { BsFillExclamationOctagonFill } from 'react-icons/bs';
import { Button } from './ui/button';
import { DialogClose } from './ui/dialog';
import { useRouter } from 'next/navigation';

export default function SignoutModal({
  username,
  firstName,
  initialized,
}: {
  username: string | null | undefined;
  firstName: string | null | undefined;
  initialized: boolean;
}) {
    const router = useRouter()
  return (
    <div className="flex justify-center items-center text-center flex-col gap-y-5">
      <div className="bg-red-200/40 rounded-full w-16 h-16 flex items-center justify-center mr-2">
        <BsFillExclamationOctagonFill className="fill-red-500 w-8 h-8" />
      </div>
      <h1 className="text-xl font-semibold">Sign out?</h1>

      <h1 className="text-muted-foreground font-light">
        Are you sure you want to sign out of your current account
        {username && `, ${firstName}`}? You will need to login with your
        password/provider again.
      </h1>

      <hr className="w-full border-t" />
      <div className="flex gap-x-4">
        {initialized ? (
          <SignOutButton>
            <Button onClick={() => router.push('/sign-in')} variant="destructive">Sign Out</Button>
          </SignOutButton>
        ) : (
          <Button variant="destructive">Sign Out</Button>
        )}
        <DialogClose asChild>
          <Button>Cancel</Button>
        </DialogClose>
      </div>
    </div>
  );
}
