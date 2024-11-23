import { User } from "@/contexts/authContext";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:4000";
let token: string = "";
if (typeof localStorage !== "undefined") {
  token = localStorage.getItem("token") || "";
}

export interface ApiResponse {
  status: boolean;
  message: string;
  data?: {
    token?: string;
    user?: User;
  };
}
export const login = (
  email: string,
  password: string
): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    const config: AxiosRequestConfig = {
      url: `/api/user/login`,
      method: "POST",
      params: {},
      data: {
        email,
        password,
      },
    };

    axios(config)
      .then((response: AxiosResponse) => {
        resolve({
          status: true,
          message: "Success.",
          data: {
            token: response?.data?.token,
          },
        });
      })
      .catch((error: AxiosError<ApiResponse>) => {
        resolve({
          status: false,
          message: String(error.response?.data?.message || ""),
        });
      });
  });
};

export const profile = (): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    const config: AxiosRequestConfig = {
      url: `/api/user/profile`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
      params: {},
      data: {},
    };

    axios(config)
      .then((response: AxiosResponse) => {
        resolve({
          status: true,
          message: "Success.",
          data: {
            user: response?.data?.user,
          },
        });
      })
      .catch((error: AxiosError<ApiResponse>) => {
        resolve({
          status: false,
          message: String(error.response?.data?.message || ""),
        });
      });
  });
};
