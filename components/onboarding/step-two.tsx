import React, { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StepTwoSchema } from '@/schemas/onboarding';
import { UserResource } from '@clerk/types/dist/user';
import { ServerGetUserWithUsername } from '@/actions/user';
import { cn } from '@/lib/utils';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import { FaRegSadCry } from 'react-icons/fa';

interface StepTwoProps {
  loading: boolean;
  user: UserResource | undefined | null;
  onSubmit: (values: z.infer<typeof StepTwoSchema>) => void;
}

export default function StepTwo({ user, loading, onSubmit }: StepTwoProps) {
  const [usernameMessage, setUsernameMessage] = useState('');
  const [fetching, setFetching] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const usernameAvailable = usernameMessage == 'This name is available!';

  const form = useForm<z.infer<typeof StepTwoSchema>>({
    resolver: zodResolver(StepTwoSchema),
    defaultValues: { username: user?.username! },
  });

  useEffect(() => {
    if (user?.username) {
      form.reset({
        username: user.username || '',
      });
    }
  }, [form, user]);

  const { username: formUsername } = form.watch();

  useEffect(() => {
    if (formUsername && formUsername.length == 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [formUsername]);

  useEffect(() => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if (!formUsername || formUsername.length == 0) {
      setUsernameMessage('');
      return;
    }

    if (!usernameRegex.test(formUsername)) {
      setUsernameMessage('Username can only contain letters and numbers');
      return;
    } /*  else {
      setUsernameMessage('');
    } */

    const checkUsernameAvailability = async () => {
      try {
        setFetching(true);
        const fetchedUser = await ServerGetUserWithUsername(formUsername);

        if (!formUsername) {
          setUsernameMessage('');
          return;
        }

        if (fetchedUser && user?.username == fetchedUser.username) {
          setUsernameMessage('You already have this username!');
        } else if (fetchedUser?.username) {
          setUsernameMessage('This username is already taken');
          setDisabled(true);
        } else {
          setUsernameMessage('This name is available!');
          setDisabled(false);
        }
      } catch (error) {
        console.error('Error checking username availability:', error);
        setUsernameMessage('Error checking username availability');
      } finally {
        setFetching(false);
      }
    };

    checkUsernameAvailability();
  }, [formUsername]);

  return (
    <div className="flex flex-col gap-y-3 w-full justify-center">
      <h1 className="text-xl font-semibold">Pick a username</h1>
      <Form {...form}>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder={'Enter a username'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {usernameMessage && (
            <div
              className={cn(
                'flex gap-x-2 items-center px-4 py-2 text-sm rounded-lg',
                usernameAvailable
                  ? 'bg-green-500/30 border border-green-500 '
                  : 'bg-red-500/30 border border-red-500 '
              )}
            >
              {fetching ? (
                <FiLoader size={18} className="animate-spin" />
              ) : usernameAvailable ? (
                <FiCheckCircle size={18} />
              ) : (
                <FaRegSadCry size={18} />
              )}
              <p>
                {usernameMessage && !fetching ? usernameMessage : 'Checking...'}
              </p>
            </div>
          )}

          <Button disabled={loading || disabled} type="submit">
          {loading ? (
              <div className="flex items-center gap-x-2">
                <p>Loading...</p>
                <FiLoader className="animate-spin" />
              </div>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
