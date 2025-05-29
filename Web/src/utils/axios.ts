import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { HOST_API } from "../config-global";

import { ApiErrorResponse } from "./ApiResponse";

const axiosInstance = axios.create({
  baseURL: HOST_API,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    try {
      if (error.response) {
        if (error.response.status === 403) {
          window.location.href = "/403";
        }
        const responseData = error.response.data as
          | ApiErrorResponse
          | undefined;
        return Promise.reject(responseData);
      }
      console.error("API Error:", error);
      return Promise.reject(new Error("Something went wrong"));
    } catch {
      return Promise.reject(new Error("Something went wrong"));
    }
  }
);
export default axiosInstance;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const method = config?.method || "get";

  let res;
  switch (method.toLowerCase()) {
    case "post":
      res = await axiosInstance.post(url, config?.data, { ...config });
      break;
    case "put":
      res = await axiosInstance.put(url, config?.data, { ...config });
      break;
    case "delete":
      res = await axiosInstance.delete(url, { ...config });
      break;
    default:
      res = await axiosInstance.get(url, { ...config });
      break;
  }
  return res.data;
};

export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    verifyEmail: "/auth/send-confirm-email-code",
    sendresetPasswordCode: "/auth/send-reset-pass-code",
    resetPassword: "/auth/reset-pass",
  },
  user: {
    list: "/api/users/query",
    details: "/api/user",
    search: "/api/product/search",
    listResponse: "/users",
    listRoles: "/users/roles",
    asignRoles: (userId: number) => `/users/${userId}/roles`,
    profile: "/users/profile",
  },
  topic: { root: "/topics" },
  question: {
    root: "/toeics/questions",
    part1: "/toeics/part-1/questions",
    part2: "/toeics/part-2/questions",
    part34: "toeics/part-34/groups",
  },

  tag: {
    root: "/toeics/tags",
  },
  track: {
    root: "/tracks",
    details: (trackId: number) => `/tracks/${trackId}`,
    delete: (trackId: number) => `/tracks/${trackId}`,
    update: (trackId: number) => `/tracks/${trackId}`,
  },
  segment: {
    root: "/segment",
    checking: (segmentId: number) => `segments/${segmentId}/checking`,
  },
};
