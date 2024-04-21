import Image from 'next/image';
import React from 'react';
import DefaultBanner from '@/public/upscaled.jpg';
import { FaPencilRuler, FaRegCalendarAlt, FaTag } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';
import { MdPerson } from 'react-icons/md';
import { UserProfile } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { User } from '@prisma/client';
import BannerUpload from '../banner-upload';

export default function Header({authorized, user}: {authorized: boolean, user: User}) {
  return (
    <>
      <div className="group max-w-[54.85rem] mx-auto rounded-lg w-full h-60 absolute overflow-hidden inset-0">
        <Image
          alt="Default Banner"
          fill
          src={DefaultBanner}
          placeholder={'blur'}
          className="object-cover h-60"
        />

        <div className="relative w-full h-full group">
          <div className="flex items-center justify-center group-hover:opacity-100 group-hover:scale-100 opacity-0 transition scale-150 absolute inset-0 w-full h-full bg-background/70">
            <div className="mb-[10%]">
              <BannerUpload user={user}/>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-36 flex flex-col items-center">
        <div className="rounded-full overflow-hidden w-36 h-36 aspect-square bg-white outline outline-8 outline-background relative">
          {user?.image && (
            <>
              {authorized && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="group bg-background/70 rounded-full absolute inset-0 w-full flex items-center justify-center h-full z-10 opacity-0 hover:opacity-100 transition">
                      <FaPencilRuler className="scale-150 active:scale-150 duration-200 group-hover:scale-100 transition-transform w-8 h-8" />
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    closeButton
                    className="w-fit items-center justify-center max-w-none overflow-y-scroll h-[80%]"
                  >
                    <h1 className="text-xl text-center font-semibold">
                      Manage
                    </h1>
                    <UserProfile />
                  </DialogContent>
                </Dialog>
              )}

              <Image fill alt="Profile Picture" src={user.image} />
            </>
          )}
        </div>

        <h1 className="font-semibold text-xl pt-2">{`${user.first_name} ${user.last_name}`}</h1>

        <ul className="flex gap-x-4 mt-2 items-center text-sm text-muted-foreground">
          <li className="flex items-center gap-x-1.5">
            <FaTag className="w-3 h-3" />
            {user.username}
          </li>
          <li className="flex items-center gap-x-1.5">
            <FaRegCalendarAlt />
            <p>Joined {formatDate(user.createdAt)} </p>
          </li>
          <li className="flex items-center gap-x-1.5">
            <MdPerson />
            <p>{user.status}</p>
          </li>
        </ul>
      </div>
    </>
  );
}
