import { z } from "zod";

export const ProfileSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters ").optional(),
    email: z.email("Invalid email format").optional(),
  }),
});
