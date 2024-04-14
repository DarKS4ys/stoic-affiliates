import { UserButton, currentUser } from '@clerk/nextjs';
import React from 'react';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { MdPerson, MdPersonOutline } from 'react-icons/md';
import { RiNotification2Fill, RiNotification2Line } from 'react-icons/ri';

export default async function Sidebar() {
  const user = await currentUser();
  const routes = [
    {
      title: 'Home',
      icon: <AiOutlineHome />,
      icon_hover: <AiFillHome />,
      href: '/home',
    },
    {
      title: 'Notifications',
      icon: <RiNotification2Line />,
      icon_hover: <RiNotification2Fill />,
      href: '/notifications',
    },
    {
      title: 'Home',
      icon: <MdPersonOutline />,
      icon_hover: <MdPerson />,
      href: '/user', // replace with username
    },
  ];
  return (
    <div className="h-screen overflow-y-hidden border-r border-border w-64 flex flex-col gap-y-4">
      <div className="flex gap-x-2 items-center">
        <UserButton />
        <div className='flex flex-col'>
          <p className='font-semibold'>{user?.firstName}</p>
          <p className='text-muted-foreground font-light'>{user?.username}</p>
        </div>
      </div>
    </div>
  );
}
