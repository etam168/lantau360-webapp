/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 */
import { userAdmin, userEditor } from "@/api/mock";
import { ILoginRequest } from "@/interfaces/requests";
import { ILoginResponse } from "@/interfaces/responses";
import { IChangePasswordRequest } from "@/interfaces/requests";
import Axios from "axios";
/**
 * Login by username and password
 *
 * @param {String} userName user name
 * @param {String} password user password
 */
export const loginByUserName = async (
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

/**
 * Login by email and password
 *
 * @param {String} email user email
 * @param {String} password user password
 */
export const loginByPhone = async (phone, password) => {
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

/**
 * Get user information by token
 *
 * @param {String} token user token
 */
export const getUserInfo = async token => {
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

export const updateUserInfo = async (userId, data) => {
  const res = await Axios.put(`/Referlo/${userId}`, data).catch(res => ({ data: null }));

  return res.data;
};

/**
 * Get user information by token
 *
 * @param {String} token user token
 */
export const confirmAccess = async (phone, password) => {
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

export const changeUserPassword = async (
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
