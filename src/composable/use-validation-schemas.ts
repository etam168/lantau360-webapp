// src/composables/useValidationSchemas.ts
import { object, string } from "yup";

export function useValidationSchemas() {
  const emailSchema = string()
    .required("Email is required")
    .email("Invalid email format")
    .max(255, "Email must not exceed 255 characters");

  const passwordSchema = string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters");

  const getEmptySchema = () => object({});

  return {
    emailSchema,
    passwordSchema,
    getEmptySchema
  };
}
