import axios from "axios";
import { EmailI, LoginData } from "../shared/types/auth";
import service from "./service";
const baseUrl = import.meta.env.VITE_APP_API_URL;

export const login = (data: LoginData) => {
  return axios.post(`${baseUrl}/login/`, data);
};

export const refreshToken = (data: LoginData) => {
  return axios.post(`${baseUrl}/refresh`, data);
};

export const sendRecoveryEmail = (email: EmailI) => {
  return axios.post(`${baseUrl}/password/email`, email);
};

export const passwordRecovery = (data: EmailI) => {
  return axios.post(`${baseUrl}/password/reset`, data);
};

export const Azure = () => {
  return axios.get(`${baseUrl}/social/azure`);
};

export const AzurePost = (code: string) => {
  return service.post(`${baseUrl}/social/azure`, { code: code });
};
