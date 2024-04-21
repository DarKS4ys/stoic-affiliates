import { currentUser } from '@clerk/nextjs';
import React from 'react';

export default async function page() {
  const user = await currentUser();
  
  return (
    <div>
      Hello {user?.firstName}
    </div>
  );
}
