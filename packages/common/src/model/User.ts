import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  firebaseUId: z.string().nullable(),
  displayName: z.string().min(1, "Display name is required"),
  role: z.enum(["editor", "admin", "sysadmin", "user"]),
});

export type User = z.infer<typeof userSchema>;
