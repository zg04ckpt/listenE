import axios, { endpoints } from "../utils/axios";
import {
  IUserLoginItem,
  IUserRegisterItem,
  IUserResetPasswordItem,
} from "../types/user";

export const login = (data: IUserLoginItem) => {
  return axios.post(endpoints.auth.login, data);
};
export const registerUser = (data: IUserRegisterItem) => {
  return axios.post(endpoints.auth.register, data);
};

export const logout = () => {
  return axios.delete(endpoints.auth.logout);
};

export const sendVerifyEmailCode = (email: string) => {
  return axios.post(endpoints.auth.verifyEmail, { email });
};

export const verifyEmail = (email: string, code: string) => {
  return axios.put(endpoints.auth.verifyEmail, { email, code });
};

export const sendResetPasswordCode = (email: string) => {
  return axios.post(endpoints.auth.sendresetPasswordCode, { email });
};

export const resetPassword = (data: IUserResetPasswordItem) => {
  return axios.put(endpoints.auth.resetPassword, data);
};

export const handleGoogleCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const returnUrl = urlParams.get("returnUrl") || "/topics";

  window.location.href = returnUrl;
};
