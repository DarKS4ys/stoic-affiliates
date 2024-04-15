import React from 'react';
import { UserResource } from '@clerk/types/dist/user';
import SuccessAnimation from '@/public/checkmarkAnimation.json';
import Lottie from 'lottie-react';

interface StepFourProps {
  user: UserResource | undefined | null;
}

export default function StepFour({ user }: StepFourProps) {
  return (
    <div className="flex flex-col gap-y-3 w-full justify-center items-center">
      <h1 className="text-xl font-semibold">You&apos;re all set!</h1>
      <Lottie loop={false} className="h-48" animationData={SuccessAnimation} />
    </div>
  );
}
