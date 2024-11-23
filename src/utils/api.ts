import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:4000";

export interface ApiResponse {
  [key: string]: any;
}

export const login = async (email: string, password: string) => {
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
      .then((response: AxiosResponse<ApiResponse>) => {
        resolve(response.data);
      })
      .catch((error: AxiosError<ApiResponse>) => {
        toast.error(String(error.response?.data?.message || ""));
      });
  });
};
