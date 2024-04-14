'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import Onboarding from './onboarding';

export default function OnboardingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const onboarding = searchParams.get('onboarding');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && (
        <Dialog open={!!onboarding}>
          <DialogContent className="h-80 overflow-hidden">
            <Onboarding/>
          </DialogContent>
        </Dialog>
      )}
      {children}
    </>
  );
}
