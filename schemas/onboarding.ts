import * as z from 'zod';

export const StepOneSchema = z.object({
  firstName: z.string().min(1, {
    message: 'First name is required.',
  }),
  lastName: z.optional(
    z.string().max(40, { message: 'Last name must be at most 40 characters' })
  ),
});

export const StepTwoSchema = z.object({
  username: z
    .string()
    .max(29, {
      message: 'Username must be shorter than 30 characters.',
    })
    .min(1, {
      message: 'Username is required.',
    }),
});

export const StepThreeSchema = z.object({
  description: z.optional(
    z.string().max(499, {
      message: 'Bio must be shorter than 500 characters.',
    })
  ),
});
