/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 */
import { userAdmin, userEditor } from "@/api/mock";
import { ILoginRequest } from "@/interfaces/requests";
import { ILoginResponse } from "@/interfaces/responses";
import { IChangePasswordRequest } from "@/interfaces/requests";
import Axios from "axios";

// const newInput = () => {
//   return {
//     modifiedAt: new Date()
//   } as Content;
// };

// const error = ref<string | null>(null);

export function useMemberInput() {
  //   const contentInput = ref<Content>(newInput());

  const loginByUserName = async (
    loginRequest: ILoginRequest
  ): Promise<ILoginResponse | undefined> => {
    let response;
    await Axios({
      url: "/MemberAuth/SignIn",
      method: "POST",
      data: { login: loginRequest.userName, password: loginRequest.password }
    })
      .then(({ data }) => {
        response = { ...data };
      })
      .catch(error => {
        throw new Error(error.response.data || "User is not found");
      });
    if (!response || !response["token"]) {
      throw new Error("User is not found");
    }
    return response;
  };

  const loginByPhone = async (phone: any, password: any) => {
    let user = {};
    await Axios({
      url: "/api/referloauth/signin",
      method: "POST",
      data: { login: phone, password }
    })
      .then(response => {
        user = response["data"];
      })
      .catch(error => {
        //console.log(error);
      });
    if (!user || !user["token"]) {
      throw new Error("User is not found");
    }
    return { user };
  };
  const getUserInfo = async (token: any) => {
    let user = {};
    try {
      if (!token) {
        throw new Error("Invalid token");
      }

      if (token === userAdmin.token) {
        user = userAdmin;
      } else {
        user = userEditor;
      }
    } catch (err) {
      //console.warn(`[getUserInfo] ${err}`);
    }
    return { user };
  };
  const updateUserInfo = async (userId: any, data: any) => {
    const res = await Axios.put(`/Referlo/${userId}`, data).catch(res => ({ data: null }));

    return res.data;
  };

  const confirmAccess = async (phone: any, password: any) => {
    try {
      if (userEditor.phone === phone && userEditor.password === password) {
        return true;
      } else if (userAdmin.phone === phone && userAdmin.password === password) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      //console.warn(`[confirmAccess] ${err}`);
    }
  };

  const changeUserPassword = async (
    changePasswordRequest: IChangePasswordRequest
  ): Promise<ILoginResponse | undefined> => {
    let response;
    await Axios({
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
        throw new Error(error.response.data || "Password not updated");
      });
    return response;
  };

  return {
    loginByUserName,
    loginByPhone,
    getUserInfo,
    updateUserInfo,
    confirmAccess,
    changeUserPassword
  };
}
