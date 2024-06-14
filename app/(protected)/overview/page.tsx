import { currentUser } from '@clerk/nextjs';
import React from 'react';

export default async function page() {
  const currUser = await currentUser();
  return (
    <div className="w-full">
      {currUser?.firstName}
    </div>
  );
}
