import axios from "axios";
import { API_CONFIG } from "@/shared/api/config";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
