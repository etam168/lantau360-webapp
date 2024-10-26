import { message } from "typia/lib/protobuf";

export default {
  button: {
    login: "Sign in",
    logout: "Logout",
    joinNow: "Join now",
  },

  hint: {
    otp: "(Step 1 - enter the one time password from your email)",
    newPassword: "(Step 2 - enter your new password and click reset)"
  },
  
  message: {
    invalidUserPassword: "Invalid username or password.",
    emailSentSuccessfully: "Please check your email for the confirmation link"

  },

  label: {
    register: "Register",
    backToSignIn: "Go back to Sign in",
    resetPassword: "Reset Password",
    logon: "Log In",
    forgotPassword: "Forgot Password",
    email: "Email (For Logon)",
    firstName: "First Name",
    lastName: "Last Name",
    otp: "One Time Password",
    newPassword: "New Password",
    password: "Password",
    registerPassword: "Password",
    userName: "User Name",
    checkInCaption: "For checkIn please signIn first",
    passwordResetSuccessfully: "Password reset successfully",
  },

  schema: {
    emailRequired: "Please enter your Email..",
    emailExceedLimit: "Email must not exceed 255 characters",
    firstName: "First Name is Required",
    invalidEmail: "Email is invalid",
    invalidUserName: "Please enter your email here",
    lastName: "Last Name is Required",
    otpRequired: "OTP is Required",
    password: "Password is Required",
    passwordMinLength: "Password must be at least 6 characters",
    phoneRequired: "Phone is Required",
    userNameRequired: "Your Email address is Required!!"
  }
};
