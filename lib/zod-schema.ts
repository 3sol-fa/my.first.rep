import { z } from 'zod';

export const InquirySchema = z.object({
    name: z.string().min(2, { message: "Please enter at least 2 characters for your name." }),
    email: z
        .string()
        .email({ message: "Please enter a valid email address." }),
    subject: z
        .string()
        .min(1, { message: "Please enter a subject." }),
    message: z
        .string()
        .min(5, { message: "Please enter at least 5 characters for the message." }),
    });
    