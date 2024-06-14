import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import {
  StepOneSchema,
  StepThreeSchema,
  StepTwoSchema,
} from '@/schemas/onboarding';
import { useUser } from '@clerk/nextjs';
import {
  ServerGetUserWithUsername,
  ServerFetchUserByExternalId,
  updateUser,
  updateUserMetadata,
} from '@/actions/user';
import StepOne from './step-one';
import StepTwo from './step-two';
import { AnimatePresence, motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import StepThree from './step-three';
import StepFour from './step-four';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitalLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [step, setStep] = useState<undefined | number>(undefined);

  const { user } = useUser();
  const router = useRouter()

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

  const onSubmit = async (
    values: z.infer<
      typeof StepOneSchema | typeof StepTwoSchema | typeof StepThreeSchema
    >
  ) => {
    try {
      setLoading(true);

      if ('username' in values) {
        const fetchedUser = await ServerGetUserWithUsername(
          values.username
        );

        if (fetchedUser?.username) {
          setLoading(false);
          return;
        }
      }

      if (user?.id) {
        if (step && step < 3) {
          await updateUser(user.id, values);
          await updateUserMetadata(user.id, { onboarding: (step || 1) + 1 });
        } else {
          await updateUserMetadata(user.id, {
            ...values,
            onboarding: (step || 1) + 1,
          });
        }

        if (step && step == 3) {
          router.refresh()
        }

        setStep((prevStep) => (prevStep || 1) + 1);
      } else {
        setError('You are not allowed to perform this action.');
        return;
      }

      // ! REPLACE WITH TOAST
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
    <div className="flex flex-col relative gap-y-4 items-center h-full w-full">
      {initialLoading && (
        <div className="flex justify-center items-center h-full w-full flex-col gap-y-4">
          <FiLoader className="animate-spin w-20 h-20" />
        </div>
      )}
      {!initialLoading && (
        <>
          <AnimatePresence>
            {step == 1 && (
              <motion.div
                transition={{ type: 'spring', damping: 15 }}
                className="w-full absolute inset-0"
                initial={{ opacity: 0, x: -500, scale: 0.75 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ x: -500, opacity: 0, scale: 0.75 }}
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
                initial={{ opacity: 0, x: 500, scale: 0.75 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ x: -500, opacity: 0, scale: 0.75 }}
              >
                <StepTwo loading={loading} user={user} onSubmit={onSubmit} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step == 3 && (
              <motion.div
                transition={{ type: 'spring', damping: 15 }}
                className="w-full absolute inset-0"
                initial={{ opacity: 0, x: 500, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ x: -500, opacity: 0, scale: 0.75 }}
              >
                <StepThree loading={loading} user={user} onSubmit={onSubmit} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step == 4 && (
              <motion.div
                transition={{ type: 'spring', damping: 15 }}
                className="w-full absolute inset-0"
                initial={{ opacity: 0, x: 500, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ x: -500, opacity: 0, scale: 0.75 }}
              >
                <StepFour user={user} />
              </motion.div>
            )}
          </AnimatePresence>

          {step && (
            <>
              {step <= 3 && (
                <p className="absolute bottom-0 text-xs">
                  {`${step} out of 3 complete`}
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
