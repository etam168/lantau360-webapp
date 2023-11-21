/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 */
import Axios from "axios";

/**
 * Get user information by token
 *
 * @param {String} token user token
 */

export const getUserProfilePicture = async (token: string, memberId: number) => {
  let userProfilePicture = "";
  await Axios({
    url: `/MemberImage/${memberId}`,
    method: "GET"
  })
    .then(() => {
      userProfilePicture = `${import.meta.env.VITE_API_URL}/MemberImage/${memberId}`;
    })
    .catch(error => {
      userProfilePicture = "img/logo/logo.png";
      //console.log(error);
    });
  return { userProfilePicture };
};

export const updateUserProfilePicture = async (token: string, imageDetail: any) => {
  const formData = new FormData();
  formData.append("image", imageDetail.file);

  await Axios({
    url: `/MemberImage/${imageDetail.memberId}`,
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: formData
  })
    .then(res => {
      //console.log(res);
    })
    .catch(error => {
      //console.log(error);
    });

  return { userProfile: { profilePicture: `/MemberImage/${imageDetail.usermemberIdId}` } };
};
