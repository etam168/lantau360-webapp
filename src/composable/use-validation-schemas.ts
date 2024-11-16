// src/composables/useValidationSchemas.ts
import { object, string } from "yup";
import i18n from "@/plugins/i18n/i18n";

export function useValidationSchemas(i18nKey: string) {
  const { t } = i18n.global;

  const emailSchema = string()
    .required("Email is required")
    .email("Invalid email format")
    .max(255, "Email must not exceed 255 characters");

  const passwordSchema = string()
    // .required("Password is required")
    .required(t(`${i18nKey}.password`))
    .min(5, "Password must be at least 5 characters");

  const getEmptySchema = () => object({});

  return {
    emailSchema,
    passwordSchema,
    getEmptySchema
  };
}
