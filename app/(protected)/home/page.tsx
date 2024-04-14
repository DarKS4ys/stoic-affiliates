import { SignOutButton, currentUser } from '@clerk/nextjs';
import React from 'react';
import { AiOutlineAim } from 'react-icons/ai';

export default async function page() {
  const user = await currentUser();
  
  return (
    <div>
      Hello {user?.firstName} <SignOutButton />
    </div>
  );
}
