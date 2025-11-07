import { z } from "zod";

export const LoginSchema = z.object({
  body: z.object({
    email: z.email("Email not valid"),
    password: z.string().min(1, "Password is ruquired"),
  }),
});

export const RegisterSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Min 3 Characters"),
    email: z.email("Email not valid"),
    password: z
      .string()
      .min(8, "Password min character")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password contain number and special characters"
      ),
  }),
});
