import { z } from "zod";

export const uNameValidation = z
    .string()
    .min(6, 'Username must be atleast 6 characters')
    .max(15, 'Username must be atmost 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain any special character other than underscore')

export const signupSchema = z.object({
    uName: uNameValidation,
    email: z.string().email('Invalid Email ID'),
    password: z.string().min(8, { message: 'Password must be atleast 6 characters' })
})