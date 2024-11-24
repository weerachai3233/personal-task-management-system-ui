import { User } from "@/contexts/authContext";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:4000";
let token: string = "";
if (typeof localStorage !== "undefined") {
  token = localStorage.getItem("token") || "";
}

export type Method = "GET" | "POST" | "PUT" | "FETCH" | "DELETE";
export interface Project {
  project_id: string;
  title: string;
  description: string;
}
export interface Board {
  board_id: string;
  title: string;
}

export interface ApiResponse {
  status: boolean;
  message: string;
  data?: {
    token?: string;
    user?: User;
    projects?: Project[];
    boards?: Board[];
    lists?: List[];
  };
}

export interface List {
  list_id: string;
  board_id: string;
  title: string;
  position: string;
  tasks?: Task[];
}
export interface Task {
  task_id: string;
  title: string;
  position: number;
  description: string;
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

export const register = (
  username: string,
  email: string,
  password: string
): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    const config: AxiosRequestConfig = {
      url: `/api/user/register`,
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      params: {},
      data: {
        username,
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

export const project = (
  method: Method,
  params: {},
  data: {}
): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    const config: AxiosRequestConfig = {
      url: `/api/project`,
      method: method,
      headers: {
        Authorization: "Bearer " + token,
      },
      params: params,
      data: data,
    };

    axios(config)
      .then((response: AxiosResponse) => {
        resolve({
          status: true,
          message: "Success.",
          data: response.data,
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

export const board = (
  method: Method,
  asPath: string,
  params: {},
  data: {}
): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    const config: AxiosRequestConfig = {
      url: `/api/board` + asPath,
      method: method,
      headers: {
        Authorization: "Bearer " + token,
      },
      params: params,
      data: data,
    };

    axios(config)
      .then((response: AxiosResponse) => {
        resolve({
          status: true,
          message: "Success.",
          data: response.data,
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
