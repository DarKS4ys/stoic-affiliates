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
import { StepOneSchema } from '@/schemas/onboarding';
import { UserResource } from '@clerk/types/dist/user';
import { FiLoader } from 'react-icons/fi';

interface StepOneProps {
  loading: boolean;
  user: UserResource | undefined | null;
  onSubmit: (values: z.infer<typeof StepOneSchema>) => void;
}

export default function StepOne({ user, loading, onSubmit }: StepOneProps) {
  const [disabled, setDisabled] = useState(false);
  const form = useForm<z.infer<typeof StepOneSchema>>({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      firstName: user?.firstName!,
      lastName: user?.lastName!,
    },
  });

  useEffect(() => {
    if (user?.firstName || user?.lastName) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [form, user]);

  const { firstName: formFirstName } = form.watch();

  useEffect(() => {
    if (formFirstName.length == 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [formFirstName]);

  return (
    <div className="flex flex-col gap-y-3 w-full">
      <h1 className="text-xl font-semibold">Create your account</h1>
      <Form {...form}>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder={'Enter your first name'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>

                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder={'Enter your last name (optional)'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
