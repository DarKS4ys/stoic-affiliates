import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StepThreeSchema } from '@/schemas/onboarding';
import { UserResource } from '@clerk/types/dist/user';
import { Textarea } from '../ui/textarea';

interface StepThreeProps {
  loading: boolean;
  user: UserResource | undefined | null;
  onSubmit: (values: z.infer<typeof StepThreeSchema>) => void;
}

export default function StepThree({ user, loading, onSubmit }: StepThreeProps) {
  const form = useForm<z.infer<typeof StepThreeSchema>>({
    resolver: zodResolver(StepThreeSchema),
    defaultValues: {},
  });

  return (
    <div className="flex flex-col gap-y-3 w-full justify-center">
      <h1 className="text-xl font-semibold">Tell us more about yourself</h1>
      <Form {...form}>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder={'Enter some stuff that describes you (optional)'}
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            Complete
          </Button>
        </form>
      </Form>
    </div>
  );
}
