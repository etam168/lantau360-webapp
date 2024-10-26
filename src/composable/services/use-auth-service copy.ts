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

export function useAuthServiceCopy(renderMode: Ref<AuthMode>) {
  const userStore = useUserStore();

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
    const i18nKey = "auth.schema";

    switch (renderMode.value) {
      case "sendOtp":
        return object({
          userName: string()
            .email(t(`${i18nKey}.invalidUserName`))
            .required(t(`${i18nKey}.userNameRequired`))
        });

      case "register":
        return object({
          email: string()
            .email(t(`${i18nKey}.invalidEmail`))
            .required(t(`${i18nKey}.emailRequired`))
            .max(255, t(`${i18nKey}.emailExceedLimit`)),
          password: string()
            .required(t(`${i18nKey}.password`))
            .min(6, t(`${i18nKey}.passwordMinLength`, { length: 6 })),
          firstName: string().required(t(`${i18nKey}.firstName`)),
          lastName: string().required(t(`${i18nKey}.lastName`)),
          phone: string().required(t(`${i18nKey}.phone`))
        });

      case "reset":
        return object({
          password: string()
            .required(t(`${i18nKey}.password`))
            .min(6, t(`${i18nKey}.passwordMinLength`, { length: 6 })),
          otp: string().required(t(`${i18nKey}.otpRequired`))
        });

      case "login":
      default:
        return object({
          userName: string()
            .email(t(`${i18nKey}.invalidUserName`))
            .required(t(`${i18nKey}.userNameRequired`)),
          password: string()
            .required(t(`${i18nKey}.password`))
            .min(6, t(`${i18nKey}.passwordMinLength`, { length: 6 }))
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
          errorMessage = t("errors.notFound");
        } else if (
          ["invalidUsernamePassword", "invalidUsername", "accountBlocked"].includes(data)
        ) {
          errorMessage = t(`errors.${data}`);
        } else {
          errorMessage = t("errors.anErrorOccured");
        }
      } else {
        errorMessage = t("errors.anErrorOccured");
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
      notify(t("auth.message.loginSuccessMessage"), "positive");
      LocalStorage.set(STORAGE_KEYS.IsLogOn, true);
    } catch (err: any) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data === "Invalid username or password."
      ) {
        notify(t("auth.message.invalidUserPassword"), "negative");
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

      notify(t("auth.label.passwordResetSuccessfully"), "positive");
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        notify(err.message, "negative");
      } else {
        notify(t("errors.anUnExpectedError"), "negative");
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
        userName: values.userName,
        status: 1
      });

      notify(t("auth.emailMessages.emailSentSuccessfully"), "positive");
      LocalStorage.set(STORAGE_KEYS.IsLogOn, true);

      return response;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          switch (err.response?.data) {
            case "email_already_exists":
              notify(t("errors.emialAreadyExists"), "negative");
              break;
            case "something_went_wrong":
              notify(t("errors.anErrorOccured"), "negative");
              break;
            default:
              notify(t("errors.anUnExpectedError"), "negative");
          }
        } else {
          notify(t("errors.anUnExpectedError"), "negative");
        }
      } else {
        notify((err as Error).message, "negative");
      }
      throw err;
    }
  }

  async function sendOtp(userName: string) {
    try {
      // await axios.post(`/MemberAuth/SendOtp/${userName}`);
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