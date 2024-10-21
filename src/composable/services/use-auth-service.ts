import { ENTITY_URL } from "@/constants";
import { useUserStore } from "@/stores/user";
import { AxiosError } from "axios";
import i18n from "@/plugins/i18n/i18n";
import { LocalStorage } from "quasar";
import { STORAGE_KEYS } from "@/constants";

const { notify } = useUtilities();
const { api } = useApi();

const { t } = i18n.global;

export function useAuthService() {
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

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

  async function registerRequest(values: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    userName: string;
  }) {
    try {
      const response = await api.create(`${ENTITY_URL.SIGN_UP}`, {
        email: values.email,
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
        if (err.response?.status === 400 && err.response?.data === "email_already_exists") {
          notify(t("errors.emialAreadyExists"), "negative");
        } else if (
          err.response?.status === 400 &&
          err.response?.data === "something_went_wrong"
        ) {
          notify(t("errors.anErrorOccured"), "negative");
        } else {
          notify(t("errors.anUnExpectedError"), "negative");
        }
      } else {
        notify((err as any).message, "negative");
      }
      throw err;
    }
  }

  return {
    loginRequest,
    registerRequest,
  };
}