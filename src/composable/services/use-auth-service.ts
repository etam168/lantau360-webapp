import type { AuthMode } from "@/interfaces/types/auth-mode";

import { AxiosError } from "axios";
import { LocalStorage } from "quasar";
import { object, string } from "yup";
import { useUserStore } from "@/stores/user";
import { ENTITY_URL, STORAGE_KEYS } from "@/constants";

import i18n from "@/plugins/i18n/i18n";

const { notify } = useUtilities();
const { t } = i18n.global;
const { api } = useApi();

export function useAuthService(renderMode: Ref<AuthMode>) {
  const userStore = useUserStore();
  const i18nKeyError = "errors";
  const i18nKeySchema = "auth.validation";
  const i18nKey = "auth";

  const { emailSchema, passwordSchema } = useValidationSchemas(i18nKeySchema);

  const initialValues = ref({
    email: "",
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    otp: ""
  });

  const schema = computed(() => {
    switch (renderMode.value) {
      case "sendOtp":
        return object({
          userName: string()
            .email(t(`${i18nKeySchema}.invalidUserName`))
            .required(t(`${i18nKeySchema}.userNameRequired`))
        });

      case "register":
        return object({
          email: emailSchema,
          password: passwordSchema,
          firstName: string().required(t(`${i18nKeySchema}.firstName`)),
          lastName: string().required(t(`${i18nKeySchema}.lastName`)),
          phone: string().required(t(`${i18nKeySchema}.phone`))
        });

      case "reset":
        return object({
          password: passwordSchema,
          otp: string().required(t(`${i18nKeySchema}.otpRequired`))
        });

      case "login":
      default:
        return object({
          userName: string().required(t(`${i18nKeySchema}.userNameRequired`)),
          password: passwordSchema
        });
    }
  });

  function handleError(err: any) {
    let errorMessage = t("errors.anExpectedError");

    if (err instanceof AxiosError) {
      const { response } = err;

      if (response) {
        const { data, status } = response;

        if (status === 404) {
          errorMessage = t(`${i18nKeyError}.notFound`);
        } else if (
          ["invalidUsernamePassword", "invalidUsername", "accountBlocked"].includes(data)
        ) {
          errorMessage = t(`${i18nKeyError}.${data}`);
        } else {
          errorMessage = t(`${i18nKeyError}.anErrorOccured`);
        }
      } else {
        errorMessage = t(`${i18nKeyError}.anErrorOccured`);
      }
    }

    notify(errorMessage, "negative");
  }

  async function loginRequest(username: string, password: string) {
    try {
      const response = await api.create(`${ENTITY_URL.SIGN_IN}`, {
        login: username,
        password: password
      });

      userStore.SetUserInfo(response.data);
      notify(t(`${i18nKey}.message.loginSuccessMessage`), "positive");
      LocalStorage.set(STORAGE_KEYS.IsLogOn, true);
    } catch (err: any) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data === "Invalid username or password."
      ) {
        notify(t(`${i18nKey}.message.invalidUserPassword`), "negative");
      } else {
        handleError(err);
      }
      throw err;
    }
  }

  async function recoverPassword(email: string, newPassword: string, otp: string) {
    try {
      const response = await api.create(`${ENTITY_URL.RESET_PASSWORD}`, {
        email: email,
        newPassword: newPassword,
        otp: otp
      });

      notify(t(`${i18nKey}.message.passwordResetSuccessfully`), "positive");
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        notify(err.message, "negative");
      } else {
        notify(t(`${i18nKeyError}.anUnExpectedError`), "negative");
      }
      throw err;
    }
  }

  async function registerRequest(values: Record<string, any>) {
    try {
      const response = await api.create(`${ENTITY_URL.SIGN_UP}`, {
        email: values.email || values.userName, // Assuming email might be the same as userName
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        password: values.password,
        userName: values.email || values.userName, // Assuming email might be the same as userName
        status: 1
      });

      notify(t(`${i18nKey}.message.emailSentSuccessfully`), "positive");
      LocalStorage.set(STORAGE_KEYS.IsLogOn, true);

      return response;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          switch (err.response?.data) {
            case "email_already_exists":
              notify(t(`${i18nKeyError}.emialAreadyExists`), "negative");
              break;
            case "something_went_wrong":
              notify(t(`${i18nKeyError}.anErrorOccured`), "negative");
              break;
            default:
              notify(t(`${i18nKeyError}.anUnExpectedError`), "negative");
          }
        } else {
          notify(t(`${i18nKeyError}.anUnExpectedError`), "negative");
        }
      } else {
        notify((err as Error).message, "negative");
      }
      throw err;
    }
  }

  async function sendOtp(userName: string) {
    try {
      await api.create(`${ENTITY_URL.SEND_OTP}/${userName}`);
    } catch (err) {
      throw err;
    }
  }

  return {
    initialValues,
    schema,
    loginRequest,
    recoverPassword,
    registerRequest,
    sendOtp
  };
}
