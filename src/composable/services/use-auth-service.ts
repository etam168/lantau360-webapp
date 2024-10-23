import { AxiosError } from "axios";
import { LocalStorage } from "quasar";
import { object, string } from "yup";
import { useUserStore } from "@/stores/user";
import { ENTITY_URL, STORAGE_KEYS } from "@/constants";

import i18n from "@/plugins/i18n/i18n";

const { notify } = useUtilities();
const { api } = useApi();

const { t } = i18n.global;

export function useAuthService() {
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

  const schema = object({
    email: string()
      .email(t("auth.schema.invalidEmail"))
      .required(t("auth.schema.emailRequired"))
      .max(255, t("auth.schema.emailExceedLimit")),
    firstName: string().required(t("auth.schema.firstName")),
    lastName: string().required(t("auth.schema.lastName")),
    phone: string().required(t("auth.schema.phoneRequired")),
    userName: string()
      .email(t("auth.schema.invalidUserName"))
      .required(t("auth.schema.userNameRequired")),
    password: string()
      .required(t("auth.schema.password"))
      .min(8, t("auth.schema.passwordMinLength", { length: 8 })),
    otp: string().when("$mode", {
      is: "reset",
      then: schema => schema.required(t("auth.schema.otpRequired")),
      otherwise: schema => schema.optional()
    })
  });

  const messages: any = {
    invalid_user: t("auth.emailMessages.invalidUser"),
    email_not_verified: t("errors.emailNotVerified"),
    invalid_credentials: t("errors.invalidCredentials"),
    invalid_username: t("errors.invalidUsername"),
    email_sent_successfully: t("auth.emailMessages.emailSentSuccessfully"),
    email_send_failed: t("auth.emailMessages.emailSendFailed"),
    username_required: t("errors.usernameRequired"),
    email_already_verified: t("auth.emailMessages.emailAlreadyVerified")
  };

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

      notify(t("auth.login.passwordResetSuccessfully"), "positive");
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
      await axios.post(`/MemberAuth/SendOtp/${userName}`);
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
