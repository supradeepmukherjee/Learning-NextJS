import { z } from "zod";

export const msgSchema = z.object({
    content: z
        .string()
        .min(1, 'Content can\'t be empty')
        .max(500, 'Content can\'t be more than 500 characters')
})