'use client';
import { useEffect, useState } from 'react';
import Logo from '@/public/STOIC WHITE.png';
import Image from 'next/image';
import { BsChevronBarLeft } from 'react-icons/bs';
import { cn, truncateText } from '@/lib/utils';
import { MdPerson, MdPersonOutline } from 'react-icons/md';
import {
  RiNotification2Fill,
  RiNotification2Line,
  RiPercentFill,
  RiPercentLine,
  RiSettings4Fill,
  RiSettings4Line,
} from 'react-icons/ri';
import {
  AiFillHome,
  AiFillTrophy,
  AiOutlineHome,
  AiOutlineTrophy,
} from 'react-icons/ai';
import { Montserrat } from 'next/font/google';
import { UserButton, UserProfile } from '@clerk/nextjs';
import { BiLogOut } from 'react-icons/bi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { FiLoader } from 'react-icons/fi';
import SignoutModal from './signout-modal';
import {IoMdAnalytics} from 'react-icons/io'

const montserrat = Montserrat({ weight: '600', subsets: ['latin'] });

export default function Sidebar({
  firstName,
  lastName,
  username,
}: {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  username: string | null | undefined;
}) {
  // ! causes the screen to blink white on refresh :(
  const [expanded, setExpanded] = useState<boolean>(true);

  /*   const [expanded, setExpanded] = useState<boolean>(() => {
    const storedValue = localStorage.getItem('sidebarExpanded');
    return storedValue !== null ? JSON.parse(storedValue) : true;
  }); */

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(expanded));
  }, [expanded]);

  const [initialized, setInitialized] = useState(false);

  const pathname = usePathname();

  const routes = [
    {
      title: 'Dashboard',
      icon: <AiOutlineHome />,
      icon_hover: <AiFillHome />,
      href: '/dashboard',
    },
    {
      title: 'Analytics',
      icon: <IoMdAnalytics />,
      icon_hover: <IoMdAnalytics />,
      href: '/analytics',
    },
    {
      title: 'Notifications',
      icon: <RiNotification2Line />,
      icon_hover: <RiNotification2Fill />,
      href: '/notifications',
    },
    {
      title: 'Leaderboard',
      icon: <AiOutlineTrophy />,
      icon_hover: <AiFillTrophy />,
      href: '/leaderboard',
    },
    {
      title: 'Comissions',
      icon: <RiPercentLine />,
      icon_hover: <RiPercentFill />,
      href: '/comissions',
    },
    {
      title: 'Profile',
      icon: <MdPersonOutline />,
      icon_hover: <MdPerson />,
      href: username ? `/profile/${username}` : '/profile',
    },
    {
      title: 'Settings',
      icon: <RiSettings4Line />,
      icon_hover: <RiSettings4Fill />,
      href: '/settings',
      modal: true,
      modalContent: (
        <>
          <h1 className="text-xl text-center font-semibold">Manage</h1>
          <UserProfile />
        </>
      ),
    },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInitialized(true);
    }
  }, []);

  // 18.3 and 4.5
  return (
    <motion.div
      className={cn(
        'transition z-50',
        expanded ? 'w-[18.3rem] min-w-[18.3rem]' : 'w-[4.5rem] min-w-[4.5rem]'
      )}
      initial={false}
      animate={{
        width: expanded ? '18.3rem' : '4.5rem',
        minWidth: expanded ? '18.3rem' : '4.5rem',
      }}
      transition={{ type: 'tween', duration: 0.26 }}
    >
      <aside className="h-screen fixed">
        <nav className="h-full flex flex-col relative justify-center border-r border-border">
          <div className="p-5 pb-4 flex items-center justify-between">
            <div
              className={cn(
                'p-2 transition-all duration-300 overflow-hidden',
                expanded ? 'w-[15.5rem]' : 'w-8'
              )}
            >
              <Link
                className="flex items-center justify-center w-fit mx-auto"
                href="/dashboard"
              >
                <Image
                  className="w-7"
                  src={Logo}
                  alt="Logo"
                  width={128}
                  height={128}
                />

                <AnimatePresence>
                  {expanded && (
                    <motion.h1
                      exit={{ x: -50, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        'ml-4 text-3xl font-bold tracking-widest',
                        montserrat.className
                      )}
                    >
                      STOIC
                    </motion.h1>
                  )}
                </AnimatePresence>
              </Link>
            </div>

            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="active:scale-90 absolute -right-4 top-[50%] p-1.5 rounded-lg bg-primary-foreground hover:bg-border border border-border transition"
            >
              <BsChevronBarLeft
                className={cn(
                  'transition-transform',
                  !expanded && '-rotate-180'
                )}
              />
            </button>
          </div>

          <ul className="flex-1 px-4">
            {routes.map((route, i) => (
              <SidebarItem
                alert={false}
                active={pathname === route.href}
                icon={route.icon}
                modal={route.modal}
                modalContent={route.modalContent}
                iconHover={route.icon_hover}
                text={route.title}
                href={route.href}
                expanded={expanded}
                key={i}
              />
            ))}
          </ul>

          <div className="border-t flex p-3 items-center justify-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                !initialized && 'bg-border animate-pulse'
              )}
            >
              {initialized ? (
                <UserButton />
              ) : (
                <FiLoader className="animate-spin opacity-95" />
              )}
            </div>

            <div
              className={cn(
                'flex items-center justify-between overflow-hidden transition-all',
                expanded ? 'ml-2.5 w-56 duration-300' : 'w-0'
              )}
            >
              <div className="flex flex-col leading-tight ">
                <h2 className="text-sm font-medium line-clamp-1">{`${firstName} ${lastName}`}</h2>
                <h3 className="text-muted-foreground line-clamp-1 truncate font-light text-xs">
                  #{truncateText(username, 25)}
                </h3>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="active:scale-90 p-1.5 rounded-lg bg-primary-foreground hover:bg-border border border-border transition">
                    <BiLogOut />
                  </button>
                </DialogTrigger>
                <DialogContent closeButton>
                  <SignoutModal initialized={initialized} firstName={firstName} username={username}/>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </nav>
      </aside>
    </motion.div>
  );
}

export function SidebarItem({
  href,
  icon,
  text,
  active,
  alert,
  expanded,
  iconHover,
  modal,
  modalContent,
}: {
  href: any;
  icon: React.ReactNode;
  iconHover: React.ReactNode;
  text: String;
  active: boolean;
  alert: boolean;
  expanded: boolean;
  modal?: boolean;
  modalContent?: React.ReactNode;
}) {
  return (
    <li>
      {modal ? (
        <Dialog>
          <DialogTrigger asChild>
            <div
              className={cn(
                'relative active:scale-95 group flex px-3 items-center font-medium rounded-lg my-1.5 cursor-pointer transition-all',
                !active && 'text-primary opacity-60 hover:opacity-100',
                expanded ? 'py-3' : 'py-2'
              )}
            >
              <div
                className={cn(
                  'absolute inset-0 w-full h-full bg-gradient-to-tr rounded-lg opacity-0 group-hover:opacity-100 duration-200 group-hover:scale-100 transition-all',
                  active
                    ? 'opacity-100 scale-100 from-primary/50 to-primary/10 shadow-[0_0px_20px_rgba(255,_255,_255,_0.15)]'
                    : 'from-primary/30 to-background',
                  !active
                    ? expanded
                      ? 'scale-[.85]'
                      : 'scale-75'
                    : 'scale-100'
                )}
              />
              <span className="z-10 relative">
                {active && (
                  <span className="z-20 animate-fadein absolute inset-0">
                    {iconHover}
                  </span>
                )}
                <span className="z-10 animate-fadein">{icon}</span>
              </span>
              <span
                className={cn(
                  'overflow-hidden z-10 transition-all duration-300',
                  expanded ? 'ml-3 w-52' : 'w-0'
                )}
              >
                {text}
              </span>
              {alert && (
                <div
                  className={cn(
                    'absolute right-2 w-2 h-2 rounded-full bg-indigo-400',
                    !expanded && 'top-2'
                  )}
                ></div>
              )}

              {!expanded && (
                <div
                  className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gradient-to-tr from-primary via-primary/80 to-primary/40
            shadow-[0_0px_15px_rgba(255,_255,_255,_0.15)] text-background text-sm invisible opacity-20 -translate-x-3
            transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
                >
                  {text}
                </div>
              )}
            </div>
          </DialogTrigger>
          <DialogContent
            closeButton
            className="w-fit items-center justify-center max-w-none overflow-y-scroll h-[80%]"
          >
            {modalContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Link
          href={href}
          className={cn(
            'relative active:scale-95 group flex px-3 items-center font-medium rounded-lg my-1.5 cursor-pointer transition-all',
            !active && 'text-primary opacity-60 hover:opacity-100',
            expanded ? 'py-3' : 'py-2'
          )}
        >
          <div
            className={cn(
              'absolute inset-0 w-full h-full bg-gradient-to-tr rounded-lg opacity-0 group-hover:opacity-100 duration-200 group-hover:scale-100 transition-all',
              active
                ? 'opacity-100 scale-100 from-primary/50 to-primary/10 shadow-[0_0px_20px_rgba(255,_255,_255,_0.15)]'
                : 'from-primary/30 to-background',
              !active ? (expanded ? 'scale-[.85]' : 'scale-75') : 'scale-100'
            )}
          />
          <span className="z-10 relative">
            {active && (
              <span className="z-20 animate-fadein absolute inset-0">
                {iconHover}
              </span>
            )}
            <span className="z-10 animate-fadein">{icon}</span>
          </span>
          <span
            className={cn(
              'overflow-hidden z-10 transition-all duration-300',
              expanded ? 'ml-3 w-52' : 'w-0'
            )}
          >
            {text}
          </span>
          {alert && (
            <div
              className={cn(
                'absolute right-2 w-2 h-2 rounded-full bg-indigo-400',
                !expanded && 'top-2'
              )}
            ></div>
          )}

          {!expanded && (
            <div
              className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gradient-to-tr from-primary via-primary/80 to-primary/40
    shadow-[0_0px_15px_rgba(255,_255,_255,_0.15)] text-background text-sm invisible opacity-20 -translate-x-3
    transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
            >
              {text}
            </div>
          )}
        </Link>
      )}
    </li>
  );
}
