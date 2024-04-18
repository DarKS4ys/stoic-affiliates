import React from 'react';
import { UserResource } from '@clerk/types/dist/user';
import SuccessAnimation from '@/public/checkmarkAnimation.json';
import Lottie from 'lottie-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';

interface StepFourProps {
  user: UserResource | undefined | null;
}

export default function StepFour({ user }: StepFourProps) {

  const pathname = usePathname()

  const router = useRouter()

  return (
    <div className="flex flex-col gap-y-3 w-full justify-center items-center">
      <h1 className="text-xl font-semibold">You&apos;re all set!</h1>
      <Lottie loop={false} className="h-48" animationData={SuccessAnimation} />
      <Button
        onClick={() => router.push(pathname)}
        className="absolute bottom-0 right-0 text-xs"
      >
        Finish
      </Button>
    </div>
  );
}
