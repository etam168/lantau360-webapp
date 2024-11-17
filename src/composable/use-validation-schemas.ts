// useValidationSchemas.ts
import { object, string } from "yup";
import i18n from "@/plugins/i18n/i18n";

export function useValidationSchemas(i18nKey: string) {
  const { t } = i18n.global;

  const emailSchema = string()
    .required(t(`${i18nKey}.emailRequired`))
    .email(t(`${i18nKey}.invalidEmail`))
    .max(255, t(`${i18nKey}.emailExceedLimit`));

  const passwordSchema = string()
    .required(t(`${i18nKey}.password`))
    .min(6, t(`${i18nKey}.passwordMinLength`, { length: 6 }));

  const getEmptySchema = () => object({});

  return {
    emailSchema,
    passwordSchema,
    getEmptySchema
  };
}
