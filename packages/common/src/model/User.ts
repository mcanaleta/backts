import * as yup from "yup";

export const userSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  firebaseUId: yup.string().nullable(),
  displayName: yup.string().required("Display name is required"),
  role: yup.mixed().oneOf(["editor", "admin", "sysadmin", "user"]),
});

export type User = yup.InferType<typeof userSchema>;
