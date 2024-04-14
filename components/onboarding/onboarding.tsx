import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { StepOneSchema, StepTwoSchema } from '@/schemas/onboarding';
import { useUser } from '@clerk/nextjs';
import {
  ServerFetchUserByExternalId,
  updateUser,
  updateUserDB,
} from '@/actions/user';
import StepOne from './step-one';
import { cn } from '@/lib/utils';
import StepTwo from './step-two';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchUserByExternalId } from '@/data/user';
import { FiLoader } from 'react-icons/fi';

export default function Onboarding() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitalLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [step, setStep] = useState<undefined | number>(undefined);

  const { user } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setInitalLoading(true);
        if (user?.id) {
          const userData = await ServerFetchUserByExternalId(user.id);

          setStep(userData?.onboarding || 1);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setInitalLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const onSubmit = async (values: z.infer<typeof StepOneSchema | typeof StepTwoSchema>) => {
    try {
      setLoading(true);

      if (user?.id) {
        await updateUser(user.id, values);

        await updateUserDB(user.id, { onboarding: (step || 1) + 1 });

        setStep((prevStep) => (prevStep || 1) + 1);
      } else {
        setError('You are not allowed to perform this action.');
        return;
      }

      setSuccess('Successfully set the name.');
      setError(undefined);

      setTimeout(() => {
        setSuccess(undefined);
      }, 3000);
    } catch {
      setError('Failed to proceed with the action, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col relative gap-y-4 items-center w-full">
      {initialLoading && (
        <div className="flex justify-center items-center h-full w-full flex-col gap-y-4">
          <FiLoader className="animate-spin w-32 h-32" />
          <h1>Loading...</h1>
        </div>
      )}
      {!initialLoading && (
        <>
          <AnimatePresence>
            {step == 1 && (
              <motion.div
                transition={{ type: 'spring', damping: 15 }}
                className="w-full absolute inset-0"
                initial={{ opacity: 0, x: -500, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ x: -500, opacity: 0, scale: 0.8 }}
              >
                <StepOne loading={loading} user={user} onSubmit={onSubmit} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step == 2 && (
              <motion.div
                transition={{ type: 'spring', damping: 15 }}
                className="w-full absolute inset-0"
                initial={{ opacity: 0, x: 500, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ x: -500, opacity: 0, scale: 0.8 }}
              >
                <StepTwo loading={loading} user={user} onSubmit={onSubmit} />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="absolute bottom-0 text-xs">{!step ? 'Loading... ' : `${step} out of 5 complete`}</p>
        </>
      )}
    </div>
  );
}
