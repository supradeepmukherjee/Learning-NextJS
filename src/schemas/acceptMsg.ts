import { z } from "zod";

export const acceptMsgsSchema = z.object({ acceptMsgs: z.boolean() })