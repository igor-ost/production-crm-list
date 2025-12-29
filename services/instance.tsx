import axios from "axios";
import { API_URL } from "./config";

const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstanceServer = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstanceFormData = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosInstance.interceptors.request.use(config => {
  const token = getCookie("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const onResponseError = (error: any) => {
  if (error.response?.status === 401) {
    document.cookie = "token=; Max-Age=0; path=/";
    window.location.href = "/";
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
  r => r,
  onResponseError
);

axiosInstanceFormData.interceptors.response.use(
  r => r,
  onResponseError
);
