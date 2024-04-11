import { SignOutButton, currentUser } from '@clerk/nextjs';
import React from 'react';

export default async function page() {
  const user = await currentUser();

  if (!user) return <div>Not signed in</div>;

  return (<div>Hello {user?.firstName} <SignOutButton/></div>);
}
