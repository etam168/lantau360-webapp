import { ILoginRequest } from "@/interfaces/requests";
import { ILoginResponse } from "@/interfaces/responses";
import { IChangePasswordRequest } from "@/interfaces/requests";

export function useMember() {
  const { t } = useI18n({ useScope: "global" });
  const loginByUserName = async (
    loginRequest: ILoginRequest
  ): Promise<ILoginResponse | undefined> => {
    let response;
    await axios({
      url: "/MemberAuth/SignIn",
      method: "POST",
      data: { login: loginRequest.userName, password: loginRequest.password }
    })
      .then(({ data }) => {
        response = { ...data };
      })
      .catch(error => {
        throw new Error(error.response.data || t("errors.userNotFound"));
      });
    if (!response || !response["token"]) {
      throw new Error(t("errors.userNotFound"));
    }
    return response;
  };

  const changeUserPassword = async (
    changePasswordRequest: IChangePasswordRequest
  ): Promise<ILoginResponse | undefined> => {
    let response;
    await axios({
      url: "/api/MemberAuth/UpdatePasword",
      method: "PUT",
      data: {
        username: changePasswordRequest.userName,
        oldPassword: changePasswordRequest.oldPassword,
        newPassword: changePasswordRequest.newPassword
      }
    })
      .then(res => {
        response = res;
      })
      .catch(error => {
        throw new Error(error.response.data || t("errors.passwordNotUpdated"));
      });
    return response;
  };

  return {
    loginByUserName,
    changeUserPassword
  };
}
