import axios from "axios";
import { refreshToken } from "./auth";
const BASE_URL = import.meta.env.VITE_APP_API_URL;

export const CancelToken = axios.CancelToken;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => (error ? promise.reject(error) : promise.resolve(token)));
  failedQueue = [];
};

const service = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const serviceBlob = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    ResponsType: "blob",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

serviceBlob.interceptors.request.use(
  (request) => {
    request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return request;
  },
  (error) => {
    return error;
  }
);

serviceBlob.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status) {
      const { status } = error.response;

      if (status === 401 && window.location.pathname !== "/login") {
        localStorage.removeItem("token");
      }
    }

    return Promise.reject(error);
  }
);

service.interceptors.request.use(
  (request) => {
    request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return request;
  },
  (error) => {
    return error;
  }
);

service.interceptors.response.use(
  (data) => data,
  (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && localStorage.token) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshToken({ token: localStorage.token })
          .then(({ data }) => {
            window.localStorage.setItem("token", data.token);
            originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
            processQueue(null, data.token);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            delete localStorage.token;
            window.location.href = "/login";
            reject(err);
          })
          .finally(() => (isRefreshing = false));
      });
    }

    return Promise.reject(error);
  }
);

export default service;
