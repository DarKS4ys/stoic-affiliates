import { db } from '@/lib/prisma';
import React from 'react';
import { currentUser } from '@clerk/nextjs';
import Header from '@/components/profile/Header';

export default async function page({
  params: { username },
}: {
  params: { username: string };
}) {
  const user = await db.user.findFirst({
    where: { username },
  });

  if (!user) {
    return;
    // user not found
  }

  const currUser = await currentUser();

  const authorized = currUser?.id === user.externalId;

  return (
    <div className="flex flex-col w-full px-12 py-6">
      <div className="flex flex-col relative items-center justify-center">
        <Header user={user} authorized={authorized} />
      </div>
    </div>
  );
}
